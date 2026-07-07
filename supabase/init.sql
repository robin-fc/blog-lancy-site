-- blog-lancy-site Supabase 数据库初始化
-- 在 Supabase Dashboard → SQL Editor 中执行

-- ========== 1. profiles ==========
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'team')),
  ai_usage_monthly JSONB NOT NULL DEFAULT '{
    "layout": 0,
    "title": 0,
    "image": 0,
    "month": ""
  }'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 新用户注册时自动创建 profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========== 2. articles ==========
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '未命名文章',
  content TEXT NOT NULL DEFAULT '',
  style_pack_id TEXT,
  template_id TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  word_count INTEGER NOT NULL DEFAULT 0,
  views INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0,
  shares INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ========== 3. style_packs ==========
CREATE TABLE IF NOT EXISTS public.style_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- NULL = 系统内置
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ========== 4. templates ==========
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'scene',
  industry TEXT NOT NULL DEFAULT '',
  scene TEXT NOT NULL DEFAULT '',
  structure TEXT NOT NULL DEFAULT '',
  thumbnail_url TEXT,
  content_template TEXT NOT NULL DEFAULT '',
  style_pack_id TEXT,
  use_count INTEGER NOT NULL DEFAULT 0,
  is_pro BOOLEAN NOT NULL DEFAULT false,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ========== 5. assets ==========
CREATE TABLE IF NOT EXISTS public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'audio', 'document')),
  url TEXT NOT NULL,
  size_bytes BIGINT NOT NULL DEFAULT 0,
  mime_type TEXT NOT NULL DEFAULT '',
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ========== RLS 策略 ==========

-- profiles: 用户只能读写自己的
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- articles: 用户只能操作自己的
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own articles" ON public.articles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own articles" ON public.articles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own articles" ON public.articles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own articles" ON public.articles FOR DELETE USING (auth.uid() = user_id);

-- style_packs: 用户可看内置+自己的，只能改自己的
ALTER TABLE public.style_packs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view default styles" ON public.style_packs FOR SELECT USING (is_default = true OR auth.uid() = user_id);
CREATE POLICY "Users can create own styles" ON public.style_packs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own styles" ON public.style_packs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own styles" ON public.style_packs FOR DELETE USING (auth.uid() = user_id);

-- templates: 所有人可读，只有管理员可写（通过 service_role key）
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view templates" ON public.templates FOR SELECT USING (true);

-- assets: 用户只能操作自己的
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own assets" ON public.assets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own assets" ON public.assets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own assets" ON public.assets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own assets" ON public.assets FOR DELETE USING (auth.uid() = user_id);

-- ========== Storage Buckets ==========
-- 在 Supabase Dashboard → Storage 中手动创建:
-- 1. avatars    (public, 图片头像)
-- 2. article-images (private, 文章配图)
-- 3. assets     (private, 用户素材)

-- Storage RLS: article-images 和 assets 只允许上传者自己访问
-- 在 Storage → Policies 中添加:
-- INSERT: auth.uid()::text = storage.foldername(name)[1]
-- SELECT: auth.uid()::text = storage.foldername(name)[1]

-- ========== 插入内置风格包 ==========
INSERT INTO public.style_packs (name, description, config, is_default) VALUES
('极简黑白', '大量留白、黑色正文、仅用灰度。适合科技/商业/个人品牌', '{"colors":{"primary":"#000000","secondary":"#4B5563","accent":"#9CA3AF","background":"#FFFFFF","text":"#111827"},"typography":{"headingFont":"system-ui","bodyFont":"system-ui","headingSizes":["24px","20px","18px"],"bodySize":"15px","lineHeight":2},"components":{"quoteStyle":"left-border","cardStyle":"flat","dividerStyle":"line","buttonStyle":"rounded"},"spacing":{"paragraphGap":"1.5em","sectionGap":"2.5em"},"imageTreatment":{"borderRadius":"0px","shadow":"none","caption":true}}'::jsonb, true),
('杂志风', '衬线标题、精致分隔线、引用卡片。适合文化/时尚/深度', '{"colors":{"primary":"#1E293B","secondary":"#7C3AED","accent":"#C084FC","background":"#FAFAFA","text":"#1F2937"},"typography":{"headingFont":"Georgia, serif","bodyFont":"system-ui","headingSizes":["26px","22px","18px"],"bodySize":"16px","lineHeight":1.85},"components":{"quoteStyle":"block","cardStyle":"rounded-shadow","dividerStyle":"wave","buttonStyle":"pill"},"spacing":{"paragraphGap":"1.8em","sectionGap":"3em"},"imageTreatment":{"borderRadius":"8px","shadow":"subtle","caption":true}}'::jsonb, true),
('活泼多彩', '圆角卡片、Emoji点缀、渐变按钮。适合生活/亲子/美食', '{"colors":{"primary":"#F97316","secondary":"#EC4899","accent":"#8B5CF6","background":"#FFFBEB","text":"#374151"},"typography":{"headingFont":"system-ui","bodyFont":"system-ui","headingSizes":["24px","20px","17px"],"bodySize":"15px","lineHeight":1.8},"components":{"quoteStyle":"left-border","cardStyle":"rounded-shadow","dividerStyle":"dots","buttonStyle":"pill"},"spacing":{"paragraphGap":"1.5em","sectionGap":"2em"},"imageTreatment":{"borderRadius":"12px","shadow":"medium","caption":true}}'::jsonb, true),
('学术严谨', '注释上标、参考文献格式、专业术语高亮。适合教育/科研/医疗', '{"colors":{"primary":"#1E40AF","secondary":"#6B7280","accent":"#3B82F6","background":"#FFFFFF","text":"#1F2937"},"typography":{"headingFont":"Georgia, serif","bodyFont":"system-ui","headingSizes":["22px","19px","16px"],"bodySize":"15px","lineHeight":1.85},"components":{"quoteStyle":"block","cardStyle":"outlined","dividerStyle":"line","buttonStyle":"rounded"},"spacing":{"paragraphGap":"1.6em","sectionGap":"2.5em"},"imageTreatment":{"borderRadius":"4px","shadow":"subtle","caption":true}}'::jsonb, true),
('夜读情感', '深色背景、暖色文字、短句分行。适合情感/故事/晚安文', '{"colors":{"primary":"#F59E0B","secondary":"#D97706","accent":"#FBBF24","background":"#1A1A2E","text":"#E5E7EB"},"typography":{"headingFont":"system-ui","bodyFont":"system-ui","headingSizes":["24px","20px","17px"],"bodySize":"16px","lineHeight":2},"components":{"quoteStyle":"minimal","cardStyle":"flat","dividerStyle":"dots","buttonStyle":"pill"},"spacing":{"paragraphGap":"2em","sectionGap":"3em"},"imageTreatment":{"borderRadius":"8px","shadow":"subtle","caption":true}}'::jsonb, true),
('数据报告', '图表配色、关键数字放大、信息图表化。适合行业分析/财报解读', '{"colors":{"primary":"#0EA5E9","secondary":"#64748B","accent":"#06B6D4","background":"#F8FAFC","text":"#1E293B"},"typography":{"headingFont":"system-ui","bodyFont":"system-ui","headingSizes":["22px","19px","16px"],"bodySize":"15px","lineHeight":1.75},"components":{"quoteStyle":"left-border","cardStyle":"outlined","dividerStyle":"line","buttonStyle":"rounded"},"spacing":{"paragraphGap":"1.5em","sectionGap":"2em"},"imageTreatment":{"borderRadius":"4px","shadow":"none","caption":true}}'::jsonb, true);

-- ========== 插入示例模板 ==========
INSERT INTO public.templates (name, description, category, industry, scene, structure, content_template, style_pack_id, is_default) VALUES
('日常推文', '通用日常推文模板，简洁专业', 'scene', '', 'daily', 'text', '<h1>{标题}</h1><p>{正文开头}</p><h2>{小标题1}</h2><p>{正文段落1}</p><h2>{小标题2}</h2><p>{正文段落2}</p><blockquote>{金句/引用}</blockquote><p>{结尾/互动}</p>', NULL, true),
('产品发布', '产品发布通知模板，突出亮点', 'scene', '', 'launch', 'text-image', '<h1>{产品名}正式发布</h1><p>{一句话亮点}</p><h2>核心功能</h2><ul><li>{功能1}</li><li>{功能2}</li><li>{功能3}</li></ul><h2>使用方式</h2><p>{使用说明}</p><blockquote>{用户评价}</blockquote><p>立即体验 → {链接}</p>', NULL, true),
('行业分析', '行业深度分析模板，数据驱动', 'industry', 'tech', 'analysis', 'text-data', '<h1>{行业}趋势解读</h1><p>{背景概述}</p><h2>关键数据</h2><p>{数据1} | {数据2} | {数据3}</p><h2>趋势分析</h2><p>{分析内容}</p><h2>未来展望</h2><p>{展望内容}</p>', NULL, true);
