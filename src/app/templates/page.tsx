import Link from "next/link";
import { ArrowRight, Check, LayoutTemplate } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { builtInStylePacks } from "@/lib/styles";

const scenes: Record<string, string[]> = {
  "minimal-bw": ["商业观察", "科技评论", "个人品牌"],
  magazine: ["文化随笔", "深度报道", "人物故事"],
  lively: ["生活方式", "亲子美食", "活动推文"],
  academic: ["知识科普", "教育培训", "研究笔记"],
  "night-reading": ["情感故事", "夜读电台", "散文随笔"],
};

export default function TemplatesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div>
              <p className="mb-3 flex items-center gap-2 text-xs font-bold tracking-[0.22em] text-[#b23c22]">
                <LayoutTemplate className="h-4 w-4" />
                基础版式
              </p>
              <h1 className="font-display text-4xl font-bold leading-tight sm:text-6xl">
                五套版式，
                <br />
                足够应付大多数文章
              </h1>
            </div>
            <p className="border-l-2 border-[#d64b2a] pl-5 text-sm leading-7 text-[#62655d]">
              我们不做上千个难以选择的模板。每套版式只定义标题、正文、引用和留白的关系；正文内容永远是主角。
            </p>
          </div>

          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {builtInStylePacks.map((style, index) => (
              <article
                key={style.id}
                className="group overflow-hidden rounded-lg border border-[#cfc7b8] bg-[#fffdf8] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_rgba(31,33,29,0.1)]"
              >
                <div className="border-b border-[#d8d1c4] bg-[#e9e3d7] p-5">
                  <div
                    className="mx-auto min-h-[370px] max-w-[300px] p-7 shadow-sm"
                    style={{ backgroundColor: style.colors.background, color: style.colors.text }}
                  >
                    <p className="mb-8 text-[9px] font-bold tracking-[0.2em]" style={{ color: style.colors.accent }}>
                      SAMPLE {String(index + 1).padStart(2, "0")}
                    </p>
                    <h2
                      className="mb-5 text-2xl font-bold leading-snug"
                      style={{ color: style.colors.primary, fontFamily: style.typography.headingFont }}
                    >
                      让内容拥有
                      <br />
                      自己的呼吸
                    </h2>
                    <div className="mb-6 h-0.5 w-10" style={{ backgroundColor: style.colors.accent }} />
                    <p className="mb-5 text-xs leading-6">
                      好的版式不会替文章说话，它只是在合适的位置停顿，让读者看见真正重要的句子。
                    </p>
                    <blockquote
                      className="mb-5 border-l-2 px-3 py-2 text-[11px] leading-5"
                      style={{
                        borderColor: style.colors.accent,
                        color: style.colors.secondary,
                        backgroundColor: style.colors.background === "#FFFFFF" ? "#f4f2ed" : "rgba(127,127,127,.1)",
                      }}
                    >
                      形式退后一步，内容才能向前一步。
                    </blockquote>
                    <p className="text-xs leading-6">
                      保持标题层级稳定、段落长短适中、强调色足够克制，一篇文章就已经有了基本的秩序。
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div>
                      <p className="mb-1 text-[10px] font-bold tracking-[0.18em] text-[#9a9c94]">
                        STYLE {String(index + 1).padStart(2, "0")}
                      </p>
                      <h2 className="font-display text-2xl font-bold">{style.name}</h2>
                    </div>
                    <div className="flex gap-1.5">
                      {[style.colors.primary, style.colors.secondary, style.colors.accent].map((color) => (
                        <span
                          key={color}
                          className="h-5 w-5 rounded-full border border-black/5"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="min-h-12 text-sm leading-6 text-[#6b6e65]">{style.description}</p>
                  <div className="my-5 flex flex-wrap gap-2">
                    {(scenes[style.id] || []).map((scene) => (
                      <span key={scene} className="rounded-full border border-[#d5cec1] px-2.5 py-1 text-[10px] text-[#72756c]">
                        {scene}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={"/editor?style=" + style.id}
                    className="flex w-full items-center justify-between border-t border-[#ded7ca] pt-4 text-sm font-bold text-[#343730] transition-colors group-hover:text-[#b23c22]"
                  >
                    <span className="flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      免费使用这套版式
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-center justify-between gap-5 border-y border-[#cbc3b5] py-8 text-center sm:flex-row sm:text-left">
            <div>
              <h2 className="font-display text-2xl font-bold">不知道选哪套？</h2>
              <p className="mt-1 text-sm text-[#6b6e65]">从「极简黑白」开始。先把文章排清楚，再考虑风格。</p>
            </div>
            <Link
              href="/editor?style=minimal-bw"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-[#1f211d] px-5 text-sm font-bold text-white hover:bg-[#393c35]"
            >
              打开默认版式
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
