'use client'

import { Suspense, useEffect, useRef, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TiptapEditor } from '@/components/editor/tiptap-editor'
import { EditorSidebar } from '@/components/editor/sidebar'
import { PhonePreview } from '@/components/editor/phone-preview'
import { useEditorStore } from '@/store/editor'
import { useArticlesStore } from '@/store/articles'
import { useAIStore } from '@/store/ai'
import { exportToWechatHTML, copyToClipboard, downloadFile } from '@/lib/export'
import {
  Save,
  Download,
  Eye,
  Sparkles,
  Copy,
  FileText,
  FileDown,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Editor } from '@tiptap/react'

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error'

export default function EditorPage() {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <EditorContentWrapper />
    </Suspense>
  )
}

function EditorSkeleton() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">加载编辑器...</p>
        </div>
      </div>
    </div>
  )
}

function EditorContentWrapper() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const articleId = searchParams.get('id')

  const { content, title, stylePackId, setContent, setTitle, setStylePack } = useEditorStore()
  const { getArticle, updateArticle, createArticle } = useArticlesStore()
  const { canUse, incrementUsage } = useAIStore()

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved')
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showAITools, setShowAITools] = useState(false)
  const [aiLoading, setAILoading] = useState<string | null>(null)
  const [aiToast, setAiToast] = useState<{ msg: string; changes: string[] } | null>(null)
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null)

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const exportMenuRef = useRef<HTMLDivElement>(null)

  // 加载文章
  useEffect(() => {
    if (articleId) {
      const article = getArticle(articleId)
      if (article) {
        setTitle(article.title)
        setContent(article.content)
        setStylePack(article.stylePackId)
      }
    } else {
      setTitle('')
      setContent('')
    }
  }, [articleId, getArticle, setTitle, setContent, setStylePack])

  // 自动保存
  const performSave = useCallback(() => {
    if (saveStatus === 'saving') return
    setSaveStatus('saving')

    setTimeout(() => {
      try {
        if (articleId) {
          updateArticle(articleId, {
            title: title || '未命名文章',
            content,
            stylePackId,
          })
        } else {
          const newId = createArticle(title || '未命名文章')
          router.replace(`/editor?id=${newId}`)
        }
        setSaveStatus('saved')
      } catch {
        setSaveStatus('error')
      }
    }, 500)
  }, [articleId, title, content, stylePackId, updateArticle, createArticle, router, saveStatus])

  // 内容变化时自动保存
  useEffect(() => {
    if (content === '' && title === '') return
    setSaveStatus('unsaved')
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => performSave(), 2000)
    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current) }
  }, [content, title, stylePackId])

  // 点击外部关闭菜单
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setShowExportMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // 导出
  const handleExport = async (format: 'wechat' | 'markdown' | 'clipboard' | 'pdf') => {
    const ts = new Date().toISOString().slice(0, 10)
    const safeTitle = title || '未命名文章'
    try {
      switch (format) {
        case 'wechat': {
          const html = exportToWechatHTML(content, stylePackId)
          downloadFile(html, `${safeTitle}_${ts}.html`, 'text/html')
          break
        }
        case 'markdown': {
          const md = content
            .replace(/<h1[^>]*>(.*?)<\/h1>/g, '# $1\n')
            .replace(/<h2[^>]*>(.*?)<\/h2>/g, '## $1\n')
            .replace(/<h3[^>]*>(.*?)<\/h3>/g, '### $1\n')
            .replace(/<p[^>]*>(.*?)<\/p>/g, '$1\n\n')
            .replace(/<[^>]+>/g, '')
          downloadFile(md, `${safeTitle}_${ts}.md`, 'text/markdown')
          break
        }
        case 'clipboard': {
          await copyToClipboard(exportToWechatHTML(content, stylePackId))
          setAiToast({ msg: '已复制到剪贴板', changes: [] })
          setTimeout(() => setAiToast(null), 2000)
          break
        }
        case 'pdf':
          setAiToast({ msg: 'PDF 导出功能开发中', changes: [] })
          setTimeout(() => setAiToast(null), 2500)
          break
      }
      setShowExportMenu(false)
    } catch {
      setAiToast({ msg: '导出失败，请重试', changes: [] })
      setTimeout(() => setAiToast(null), 2500)
    }
  }

  // AI 处理
  const handleAIAction = async (action: 'polish' | 'expand' | 'simplify' | 'format') => {
    if (!content.trim()) {
      setAiToast({ msg: '请先输入内容', changes: [] })
      setTimeout(() => setAiToast(null), 2500)
      return
    }
    if (!canUse('layout')) {
      setAiToast({ msg: '本月 AI 使用次数已用完', changes: ['请升级套餐'] })
      setTimeout(() => setAiToast(null), 3000)
      return
    }

    setAILoading(action)
    setShowAITools(false)

    try {
      const { polishText, expandText, simplifyText, formatArticle } = await import('@/lib/ai-service')
      const labels: Record<string, string> = { polish: '润色', expand: '扩写', simplify: '简化', format: '排版' }
      let changes: string[] = []
      let newText = ''

      switch (action) {
        case 'polish': { const r = await polishText(content); newText = r.text; changes = r.changes; break }
        case 'expand': { const r = await expandText(content); newText = r.text; changes = r.changes; break }
        case 'simplify': { const r = await simplifyText(content); newText = r.text; changes = r.changes; break }
        case 'format': { const r = await formatArticle(content, stylePackId); newText = r.text; changes = r.changes; break }
      }

      if (newText) {
        setContent(newText)
        incrementUsage('layout')
        setAiToast({ msg: `${labels[action]}完成`, changes })
        setTimeout(() => setAiToast(null), 4000)
      }
    } catch {
      setAiToast({ msg: '处理失败，请重试', changes: [] })
      setTimeout(() => setAiToast(null), 2500)
    }

    setAILoading(null)
  }

  const wordCount = content.replace(/<[^>]+>/g, '').length
  const readTime = Math.max(1, Math.ceil(wordCount / 400))

  return (
    <div className="flex h-screen flex-col">
      <Header />

      {/* 主编辑区 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧边栏 */}
        <EditorSidebar
          selectedStyle={stylePackId}
          onStyleChange={setStylePack}
          onAIAction={handleAIAction}
          aiLoading={aiLoading}
        />

        {/* 编辑器 */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <Card className="mx-auto max-w-3xl p-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入文章标题..."
              className="w-full border-0 text-2xl font-bold placeholder:text-gray-300 focus:outline-none focus:ring-0 mb-4"
            />
            <TiptapEditor
              content={content}
              onChange={setContent}
              onEditorReady={setEditorInstance}
            />
          </Card>
        </main>

        {/* 右侧预览 */}
        <div className="hidden lg:block w-96 border-l border-gray-200 bg-gray-100 overflow-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              手机预览
            </h3>
            <PhonePreview content={content} styleId={stylePackId} />
          </div>
        </div>
      </div>

      {/* 底部状态栏 */}
      <div className="border-t border-gray-200 bg-white px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SaveStatusIndicator status={saveStatus} />
          <span className="text-xs text-gray-400">字数：{wordCount} | 阅读约 {readTime} 分钟</span>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowAITools(!showAITools)}>
            <Sparkles className="w-4 h-4" /> AI 工具
          </Button>

          <div className="relative" ref={exportMenuRef}>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowExportMenu(!showExportMenu)}>
              <Download className="w-4 h-4" /> 导出 <ChevronDown className="w-3 h-3" />
            </Button>
            {showExportMenu && (
              <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button onClick={() => handleExport('wechat')} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <FileDown className="w-4 h-4" /> 下载公众号 HTML
                </button>
                <button onClick={() => handleExport('markdown')} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <FileText className="w-4 h-4" /> 下载 Markdown
                </button>
                <button onClick={() => handleExport('clipboard')} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Copy className="w-4 h-4" /> 复制到剪贴板
                </button>
                <hr className="my-1" />
                <button onClick={() => handleExport('pdf')} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-400 hover:bg-gray-50">
                  <FileText className="w-4 h-4" /> 导出 PDF（开发中）
                </button>
              </div>
            )}
          </div>

          <Button size="sm" className="gap-1.5" onClick={performSave} disabled={saveStatus === 'saving'}>
            <Save className="w-4 h-4" /> 保存
          </Button>
        </div>
      </div>

      {/* AI Toast */}
      {aiToast && (
        <div className="fixed top-20 right-6 max-w-xs bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-30">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="font-medium text-sm">{aiToast.msg}</span>
          </div>
          {aiToast.changes.length > 0 && (
            <ul className="text-xs text-gray-500 space-y-0.5 ml-6">
              {aiToast.changes.map((c, i) => <li key={i}>• {c}</li>)}
            </ul>
          )}
        </div>
      )}

      {/* AI 工具浮层 */}
      {showAITools && (
        <div className="fixed bottom-16 right-6 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-20">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" /> AI 辅助工具
            </h4>
            <button onClick={() => setShowAITools(false)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          <div className="space-y-2">
            {[
              { id: 'polish', icon: '✨', label: '智能润色', desc: '优化语句表达' },
              { id: 'expand', icon: '📝', label: '内容扩写', desc: '补充论述说明' },
              { id: 'simplify', icon: '🔪', label: '精简提炼', desc: '删除冗余内容' },
            ].map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleAIAction(tool.id as 'polish' | 'expand' | 'simplify')}
                disabled={aiLoading !== null}
                className={cn(
                  'flex items-center gap-3 w-full p-3 rounded-lg border text-left transition-colors',
                  aiLoading === tool.id ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                )}
              >
                {aiLoading === tool.id ? <Loader2 className="w-5 h-5 animate-spin text-blue-600" /> : <span className="text-lg">{tool.icon}</span>}
                <div>
                  <div className="font-medium text-sm">{tool.label}</div>
                  <div className="text-xs text-gray-400">{tool.desc}</div>
                </div>
              </button>
            ))}
            <hr />
            <button
              onClick={() => handleAIAction('format')}
              disabled={aiLoading !== null}
              className={cn(
                'flex items-center gap-3 w-full p-3 rounded-lg border text-left transition-colors',
                aiLoading === 'format' ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
              )}
            >
              {aiLoading === 'format' ? <Loader2 className="w-5 h-5 animate-spin text-green-600" /> : <span className="text-lg">🎨</span>}
              <div>
                <div className="font-medium text-sm">一键排版</div>
                <div className="text-xs text-gray-400">应用当前风格，自动排版</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SaveStatusIndicator({ status }: { status: SaveStatus }) {
  switch (status) {
    case 'saved':
      return <span className="flex items-center gap-1 text-xs text-green-600"><CheckCircle className="w-3 h-3" /> 已自动保存</span>
    case 'saving':
      return <span className="flex items-center gap-1 text-xs text-blue-600"><Clock className="w-3 h-3 animate-spin" /> 保存中...</span>
    case 'unsaved':
      return <span className="flex items-center gap-1 text-xs text-amber-600"><AlertCircle className="w-3 h-3" /> 未保存</span>
    case 'error':
      return <span className="flex items-center gap-1 text-xs text-red-600"><AlertCircle className="w-3 h-3" /> 保存失败</span>
  }
}
