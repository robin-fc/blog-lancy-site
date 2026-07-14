"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Clipboard,
  Info,
  Lightbulb,
  Loader2,
  RefreshCw,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { generateTitles, type TitleResult } from "@/lib/ai-service";
import { cn } from "@/lib/utils";

const typeMeta: Record<TitleResult["type"], { label: string; color: string }> = {
  pain: { label: "痛点", color: "#b4442c" },
  number: { label: "数字", color: "#43614b" },
  suspense: { label: "悬念", color: "#78633e" },
  reverse: { label: "反常识", color: "#3f5d75" },
  trend: { label: "趋势", color: "#70546a" },
  emotion: { label: "情感", color: "#a05252" },
};

const sampleText =
  "做公众号三年后，我发现真正影响阅读体验的不是用了多少装饰，而是段落是否清楚、标题是否准确、重点是否克制。一篇文章只要让读者愿意继续往下滑，排版就完成了它的任务。";

export default function TitleGeneratorPage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [results, setResults] = useState<TitleResult[]>([]);
  const [filter, setFilter] = useState<TitleResult["type"] | "all">("all");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState("");

  const visibleResults = useMemo(
    () => (filter === "all" ? results : results.filter((item) => item.type === filter)),
    [filter, results],
  );

  const handleGenerate = async () => {
    if (content.trim().length < 10) return;
    setLoading(true);
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 280));
      setResults(await generateTitles(content));
      setFilter("all");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (item: TitleResult) => {
    await navigator.clipboard.writeText(item.title);
    setCopiedId(item.id);
    window.setTimeout(() => setCopiedId(""), 1800);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="px-4 py-12 sm:px-6 sm:py-18">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="mb-3 text-xs font-bold tracking-[0.22em] text-[#b23c22]">本地标题灵感</p>
              <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
                同一篇文章，
                <br />
                换六个切入角度
              </h1>
            </div>
            <div className="border-l-2 border-[#d64b2a] pl-5">
              <p className="text-sm leading-7 text-[#62655d]">
                这里不预测点击率，也不承诺“爆款”。工具只从痛点、数字、悬念、反常识、趋势和情感六种结构出发，帮你摆脱第一版标题。
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-[#85877f]">
                <Info className="h-3.5 w-3.5" />
                全程在浏览器内生成，不上传正文。
              </p>
            </div>
          </div>

          <section className="mb-8 overflow-hidden rounded-lg border border-[#cbc3b5] bg-[#fffdf8] shadow-[6px_6px_0_rgba(31,33,29,0.08)]">
            <div className="flex items-center justify-between border-b border-[#ded7ca] bg-[#f1ece1] px-5 py-3">
              <span className="text-xs font-bold tracking-[0.14em] text-[#666960]">文章摘要或正文</span>
              <button
                onClick={() => setContent(sampleText)}
                className="text-xs font-semibold text-[#b23c22] hover:underline"
              >
                填入示例
              </button>
            </div>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="粘贴文章正文，至少 10 字。内容越具体，标题越贴近原文。"
              className="min-h-52 w-full resize-y border-0 bg-[#fffdf8] px-5 py-5 text-base leading-8 text-[#30322d] outline-none placeholder:text-[#aaa79d] sm:px-7"
            />
            <div className="flex flex-col gap-3 border-t border-[#ded7ca] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-[#85877f]">
                {content.trim().length} 字
                {content.trim().length > 0 && content.trim().length < 50 ? " · 建议输入 50 字以上" : ""}
              </span>
              <div className="flex gap-2">
                {results.length > 0 && (
                  <Button variant="outline" onClick={handleGenerate} disabled={loading}>
                    <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                    换一组
                  </Button>
                )}
                <Button onClick={handleGenerate} disabled={loading || content.trim().length < 10}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {loading ? "正在拆解..." : "生成 6 个方向"}
                </Button>
              </div>
            </div>
          </section>

          {results.length > 0 ? (
            <section>
              <div className="mb-5 flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setFilter("all")}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold",
                    filter === "all" ? "bg-[#1f211d] text-white" : "border border-[#cbc3b5] bg-[#fffdf8]",
                  )}
                >
                  全部
                </button>
                {Object.entries(typeMeta).map(([key, meta]) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key as TitleResult["type"])}
                    className={cn(
                      "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold",
                      filter === key ? "text-white" : "border border-[#cbc3b5] bg-[#fffdf8]",
                    )}
                    style={filter === key ? { backgroundColor: meta.color } : undefined}
                  >
                    {meta.label}
                  </button>
                ))}
              </div>

              <div className="grid gap-3">
                {visibleResults.map((item, index) => {
                  const meta = typeMeta[item.type];
                  return (
                    <article
                      key={item.id}
                      className="group grid gap-4 rounded-lg border border-[#d4ccbd] bg-[#fffdf8] p-5 transition-all hover:-translate-y-0.5 hover:border-[#8f8d84] hover:shadow-md sm:grid-cols-[52px_minmax(0,1fr)_auto] sm:items-center"
                    >
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-full font-display text-lg font-bold text-white"
                        style={{ backgroundColor: meta.color }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold" style={{ color: meta.color }}>
                            {meta.label}结构
                          </span>
                          <span className="text-[10px] text-[#8c8e87]">结构完整度 {item.score}</span>
                          {item.risks.map((risk) => (
                            <span key={risk} className="flex items-center gap-1 text-[10px] text-[#a04a35]">
                              <ShieldAlert className="h-3 w-3" />
                              {risk}
                            </span>
                          ))}
                        </div>
                        <h2 className="font-display text-lg font-bold leading-7 text-[#292b27] sm:text-xl">
                          {item.title}
                        </h2>
                      </div>
                      <div className="flex gap-2 sm:justify-end">
                        <Button variant="outline" size="sm" onClick={() => handleCopy(item)}>
                          {copiedId === item.id ? <Check className="h-4 w-4 text-[#526653]" /> : <Clipboard className="h-4 w-4" />}
                          {copiedId === item.id ? "已复制" : "复制"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push("/editor?title=" + encodeURIComponent(item.title))}
                        >
                          去排版
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : (
            <section className="border-y border-[#d3cbbc] py-14 text-center text-[#777a71]">
              <Lightbulb className="mx-auto mb-4 h-8 w-8 text-[#ba8d42]" />
              <h2 className="font-display text-xl font-bold text-[#3f423b]">好标题应该准确，而不是夸张</h2>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6">
                先把文章讲清楚，再选择最合适的角度。工具提供的是起点，最终判断仍然属于你。
              </p>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
