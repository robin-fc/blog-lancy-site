"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Check,
  ChevronDown,
  Clipboard,
  Download,
  Eye,
  FileDown,
  FileText,
  LayoutTemplate,
  Loader2,
  LockKeyhole,
  RotateCcw,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { PhonePreview } from "@/components/editor/phone-preview";
import { useEditorStore } from "@/store/editor";
import { builtInStylePacks } from "@/lib/styles";
import { cn } from "@/lib/utils";
import {
  copyToClipboard,
  downloadFile,
  exportToWechatHTML,
} from "@/lib/export";

type ToolAction = "polish" | "expand" | "simplify" | "format";
type SaveState = "saving" | "saved";

const starterTitle = "好的排版，是让文字被看见";
const starterContent =
  "<p>我们常常把排版理解成装饰：换一种字体，加一条分隔线，再放几张好看的图片。</p>" +
  "<p>但真正有效的排版，做的恰恰是相反的事——<strong>它让形式退后，让内容走到前面。</strong></p>" +
  "<h2>先给文字留一点呼吸</h2>" +
  "<p>手机屏幕很窄。过长的段落、连续的强调色和拥挤的标题，都会让读者更快离开。把段落拆短，把层级理清，阅读自然会顺下来。</p>" +
  "<blockquote>好的排版不是让读者注意到设计，而是让读者愿意继续读下去。</blockquote>" +
  "<h2>一致，比花哨更重要</h2>" +
  "<p>一篇文章只需要一套标题、一种强调色和稳定的留白。克制不是单调，而是帮读者建立清晰的阅读预期。</p>";

const toolOptions: Array<{
  action: ToolAction;
  title: string;
  description: string;
}> = [
  { action: "format", title: "整理结构", description: "拆分长段落，统一标题与列表" },
  { action: "polish", title: "校正文字", description: "清理空格、标点和重复表达" },
  { action: "simplify", title: "精简段落", description: "去掉冗余词，合并碎片内容" },
  { action: "expand", title: "补充短段", description: "为过短段落添加衔接说明" },
];

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function EditorFallback() {
  return (
    <div className="min-h-screen bg-[#f3efe5]">
      <Header />
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center text-sm text-[#74776e]">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-[#d64b2a]" />
          正在铺开稿纸...
        </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<EditorFallback />}>
      <EditorWorkspace />
    </Suspense>
  );
}

function EditorWorkspace() {
  const searchParams = useSearchParams();
  const { content, title, stylePackId, setContent, setTitle, setStylePack, reset } =
    useEditorStore();
  const initialized = useRef(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [activePanel, setActivePanel] = useState<"styles" | "tools">("styles");
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [toolLoading, setToolLoading] = useState<ToolAction | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const requestedTitle = searchParams.get("title");
    const requestedStyle = searchParams.get("style");
    if (requestedTitle) setTitle(requestedTitle);
    if (requestedStyle && builtInStylePacks.some((item) => item.id === requestedStyle)) {
      setStylePack(requestedStyle);
    }
    if (!content && !title) {
      setTitle(requestedTitle || starterTitle);
      setContent(starterContent);
    }
  }, [content, searchParams, setContent, setStylePack, setTitle, title]);

  useEffect(() => {
    if (!initialized.current) return;
    setSaveState("saving");
    const timer = window.setTimeout(() => setSaveState("saved"), 500);
    return () => window.clearTimeout(timer);
  }, [content, stylePackId, title]);

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const fullContent = "<h1>" + escapeHtml(title || "未命名文章") + "</h1>" + content;
  const wordCount = content.replace(/<[^>]+>/g, "").replace(/\s/g, "").length;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 400));

  const handleTool = async (action: ToolAction) => {
    if (!content.trim()) {
      showToast("先粘贴或输入正文，再使用文字工具");
      return;
    }

    setToolLoading(action);
    try {
      const { polishText, expandText, simplifyText, formatArticle } = await import(
        "@/lib/ai-service"
      );
      const result =
        action === "polish"
          ? await polishText(content)
          : action === "expand"
            ? await expandText(content)
            : action === "simplify"
              ? await simplifyText(content)
              : await formatArticle(content, stylePackId);

      if (result.text) setContent(result.text);
      showToast(result.changes[0] || "处理完成");
    } catch {
      showToast("处理失败，请稍后再试");
    } finally {
      setToolLoading(null);
    }
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(exportToWechatHTML(fullContent, stylePackId));
      showToast("已复制富文本，可直接粘贴到公众号后台");
    } catch {
      showToast("复制失败，请检查浏览器剪贴板权限");
    }
  };

  const handleDownload = (format: "html" | "markdown") => {
    const safeTitle = (title || "未命名文章").replace(/[\\/:*?"<>|]/g, "-");
    if (format === "html") {
      downloadFile(
        exportToWechatHTML(fullContent, stylePackId),
        safeTitle + ".html",
        "text/html",
      );
      showToast("HTML 文件已下载");
    } else {
      const markdown = content
        .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n")
        .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n")
        .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n")
        .replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**")
        .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, "> $1\n\n")
        .replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n")
        .replace(/<[^>]+>/g, "");
      downloadFile("# " + title + "\n\n" + markdown, safeTitle + ".md", "text/markdown");
      showToast("Markdown 文件已下载");
    }
    setShowExportMenu(false);
  };

  const handleClear = () => {
    if (!window.confirm("清空当前草稿并新建一篇？此操作无法撤销。")) return;
    reset();
    setTitle("");
    setContent("");
    setStylePack("minimal-bw");
    showToast("已新建空白稿");
  };

  return (
    <div className="min-h-screen bg-[#ebe5d9]">
      <Header />

      <div className="border-b border-[#d2cabb] bg-[#fffdf8]">
        <div className="mx-auto flex min-h-16 max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div>
            <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-[#8a8c84]">
              <span>创作台</span>
              <span className="h-px w-5 bg-[#c9c2b5]" />
              <span className="text-[#b33c23]">本地草稿</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#777a71]">
              <span className="flex items-center gap-1">
                {saveState === "saved" ? (
                  <Check className="h-3.5 w-3.5 text-[#526653]" />
                ) : (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                {saveState === "saved" ? "已保存到本机" : "保存中"}
              </span>
              <span>{wordCount} 字</span>
              <span>约 {readingMinutes} 分钟</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleClear} className="hidden sm:inline-flex">
              <RotateCcw className="h-4 w-4" />
              新建
            </Button>
            <div className="relative" ref={exportMenuRef}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExportMenu((value) => !value)}
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">下载</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
              {showExportMenu && (
                <div className="absolute right-0 top-full z-40 mt-2 w-52 rounded-md border border-[#cfc7b9] bg-[#fffdf8] p-1.5 shadow-xl">
                  <button
                    onClick={() => handleDownload("html")}
                    className="flex w-full items-center gap-2 rounded px-3 py-2.5 text-left text-sm hover:bg-[#eee8dc]"
                  >
                    <FileDown className="h-4 w-4 text-[#b13b22]" />
                    公众号 HTML
                  </button>
                  <button
                    onClick={() => handleDownload("markdown")}
                    className="flex w-full items-center gap-2 rounded px-3 py-2.5 text-left text-sm hover:bg-[#eee8dc]"
                  >
                    <FileText className="h-4 w-4 text-[#526653]" />
                    Markdown
                  </button>
                </div>
              )}
            </div>
            <Button size="sm" onClick={handleCopy}>
              <Clipboard className="h-4 w-4" />
              <span className="hidden sm:inline">复制到公众号</span>
              <span className="sm:hidden">复制</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="border-b border-[#d2cabb] bg-[#f4efe5] px-4 py-2 xl:hidden">
        <div className="mx-auto flex max-w-3xl rounded-md border border-[#cbc3b5] bg-[#fffdf8] p-1">
          <button
            onClick={() => setMobileView("edit")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded px-3 py-2 text-sm font-semibold",
              mobileView === "edit" ? "bg-[#1f211d] text-white" : "text-[#6a6d64]",
            )}
          >
            <FileText className="h-4 w-4" />
            编辑
          </button>
          <button
            onClick={() => setMobileView("preview")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded px-3 py-2 text-sm font-semibold",
              mobileView === "preview" ? "bg-[#1f211d] text-white" : "text-[#6a6d64]",
            )}
          >
            <Eye className="h-4 w-4" />
            手机预览
          </button>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_380px]">
        <aside className={cn(
          "border-r border-[#d2cabb] bg-[#f4efe5] lg:block",
          mobileView === "preview" ? "hidden" : "block",
        )}>
          <div className="flex border-b border-[#d2cabb]">
            <button
              onClick={() => setActivePanel("styles")}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-bold",
                activePanel === "styles"
                  ? "border-b-2 border-[#d64b2a] bg-[#fffdf8] text-[#b33c23]"
                  : "text-[#73766d]",
              )}
            >
              <LayoutTemplate className="h-4 w-4" />
              版式
            </button>
            <button
              onClick={() => setActivePanel("tools")}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-bold",
                activePanel === "tools"
                  ? "border-b-2 border-[#d64b2a] bg-[#fffdf8] text-[#b33c23]"
                  : "text-[#73766d]",
              )}
            >
              <WandSparkles className="h-4 w-4" />
              文字工具
            </button>
          </div>

          <div className="p-4 lg:sticky lg:top-16 lg:max-h-[calc(100vh-64px)] lg:overflow-auto">
            {activePanel === "styles" ? (
              <div>
                <p className="mb-4 text-xs leading-5 text-[#777a71]">
                  版式只改变预览和导出效果，不会改动原文。
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
                  {builtInStylePacks.map((style) => {
                    const selected = stylePackId === style.id;
                    return (
                      <button
                        key={style.id}
                        onClick={() => setStylePack(style.id)}
                        className={cn(
                          "rounded-md border bg-[#fffdf8] p-3 text-left transition-all",
                          selected
                            ? "border-[#b33c23] shadow-[3px_3px_0_rgba(179,60,35,0.16)]"
                            : "border-[#d4cdbf] hover:border-[#777a71]",
                        )}
                      >
                        <div className="mb-2.5 flex gap-1">
                          <span className="h-4 w-4 rounded-full" style={{ background: style.colors.primary }} />
                          <span className="h-4 w-4 rounded-full" style={{ background: style.colors.secondary }} />
                          <span className="h-4 w-4 rounded-full border border-black/5" style={{ background: style.colors.background }} />
                        </div>
                        <span className="block font-display text-base font-bold">{style.name}</span>
                        <span className="mt-1 block text-[10px] leading-4 text-[#85877f]">{style.description}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1">
                {toolOptions.map((tool) => (
                  <button
                    key={tool.action}
                    onClick={() => handleTool(tool.action)}
                    disabled={toolLoading !== null}
                    className="rounded-md border border-[#d4cdbf] bg-[#fffdf8] p-3 text-left transition-colors hover:border-[#b33c23] hover:bg-white disabled:opacity-50"
                  >
                    <span className="mb-1 flex items-center gap-2 font-display text-base font-bold">
                      {toolLoading === tool.action ? (
                        <Loader2 className="h-4 w-4 animate-spin text-[#d64b2a]" />
                      ) : (
                        <Sparkles className="h-4 w-4 text-[#d64b2a]" />
                      )}
                      {tool.title}
                    </span>
                    <span className="block text-[10px] leading-4 text-[#85877f]">{tool.description}</span>
                  </button>
                ))}
                <p className="col-span-full mt-2 flex items-start gap-1.5 text-[10px] leading-4 text-[#85877f]">
                  <LockKeyhole className="mt-0.5 h-3 w-3 shrink-0" />
                  这些工具在浏览器内按规则处理文字，不会上传正文。
                </p>
              </div>
            )}
          </div>
        </aside>

        <main className={cn(
          "min-w-0 bg-[#ebe5d9] p-3 sm:p-6",
          mobileView === "preview" ? "hidden xl:block" : "block",
        )}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-3 flex items-center justify-between px-1">
              <span className="text-xs font-semibold tracking-[0.14em] text-[#777a71]">正文编辑</span>
              <span className="text-[10px] text-[#93958e]">支持直接粘贴富文本</span>
            </div>
            <div className="overflow-hidden rounded-lg border border-[#cbc3b5] bg-[#fffdf8] shadow-[0_8px_30px_rgba(31,33,29,0.08)]">
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="输入文章标题"
                className="w-full border-0 border-b border-[#e1dacd] bg-white px-5 py-5 font-display text-2xl font-bold text-[#242620] outline-none placeholder:text-[#aaa79d] sm:px-8 sm:py-7 sm:text-3xl"
              />
              <TiptapEditor content={content} onChange={setContent} />
            </div>
          </div>
        </main>

        <aside className={cn(
          "border-l border-[#d2cabb] bg-[#ddd6ca] p-5 xl:block",
          mobileView === "preview" ? "block border-l-0" : "hidden",
        )}>
          <div className="sticky top-20">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold tracking-[0.14em] text-[#5f625a]">手机预览</p>
                <p className="mt-1 text-[10px] text-[#85877f]">接近公众号正文宽度</p>
              </div>
              <span className="rounded-full bg-[#526653] px-2 py-1 text-[10px] text-white">实时</span>
            </div>
            <PhonePreview content={fullContent} styleId={stylePackId} />
          </div>
        </aside>
      </div>

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2 rounded-md bg-[#1f211d] px-4 py-3 text-sm text-white shadow-xl">
          <Check className="h-4 w-4 text-[#e27a60]" />
          {toast}
        </div>
      )}
    </div>
  );
}
