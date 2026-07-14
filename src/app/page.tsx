import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clipboard,
  Feather,
  LayoutTemplate,
  LockKeyhole,
  MonitorSmartphone,
  MousePointer2,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const promises = [
  { icon: LockKeyhole, label: "无需注册登录" },
  { icon: Clipboard, label: "富文本一键复制" },
  { icon: MonitorSmartphone, label: "手机效果实时预览" },
  { icon: Check, label: "永久免费 · 无水印" },
];

const steps = [
  {
    number: "01",
    title: "粘贴原稿",
    description: "从 Word、Markdown 或任意文档复制正文，标题、列表与重点格式会尽量保留。",
  },
  {
    number: "02",
    title: "挑一种版式",
    description: "不是堆素材，而是控制字体、留白、标题和引用，让整篇文章保持一致。",
  },
  {
    number: "03",
    title: "复制到公众号",
    description: "实时检查手机端效果，一键复制带格式内容，直接粘贴进微信公众平台。",
  },
];

const styleSamples = [
  { name: "留白", scene: "商业 / 科技", colors: ["#22231f", "#f6f3eb"], accent: "#22231f" },
  { name: "刊物", scene: "文化 / 深度", colors: ["#913b2c", "#e3c9a6"], accent: "#913b2c" },
  { name: "新绿", scene: "生活 / 品牌", colors: ["#45634f", "#dce3d8"], accent: "#45634f" },
  { name: "研究", scene: "教育 / 知识", colors: ["#2f506d", "#dce5e8"], accent: "#2f506d" },
  { name: "夜读", scene: "故事 / 情感", colors: ["#24272c", "#c6a86c"], accent: "#c6a86c" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24">
          <div className="pointer-events-none absolute -right-20 top-12 h-80 w-80 rounded-full border border-[#d64b2a]/15" />
          <div className="pointer-events-none absolute -right-6 top-28 h-52 w-52 rounded-full border border-[#d64b2a]/20" />
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="relative z-10">
              <div className="reveal mb-6 inline-flex items-center gap-2 border border-[#d4cbbb] bg-[#fffdf8]/80 px-3 py-1.5 text-xs font-semibold text-[#5b5e56]">
                <span className="h-2 w-2 rounded-full bg-[#d64b2a]" />
                免费使用 · 不用登录 · 内容留在本机
              </div>
              <h1 className="reveal reveal-delay-1 font-display text-[2.9rem] font-bold leading-[1.13] tracking-tight text-[#1f211d] sm:text-6xl lg:text-[4.5rem]">
                把文章粘进来，
                <br />
                <span className="relative text-[#c74326]">
                  三分钟排好
                  <svg className="absolute -bottom-3 left-0 w-full" viewBox="0 0 260 12" fill="none" aria-hidden="true">
                    <path d="M2 9C65 3 184 2 258 7" stroke="#c74326" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              <p className="reveal reveal-delay-2 mt-8 max-w-xl text-base leading-8 text-[#62655d] sm:text-lg">
                墨刻只做一件事：把普通原稿整理成一篇舒服、克制、可以直接发布的公众号文章。没有套餐墙，也没有用不上的复杂后台。
              </p>
              <div className="reveal reveal-delay-2 mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/editor"
                  className="inline-flex h-13 items-center justify-center gap-2 rounded-md bg-[#d64b2a] px-7 font-semibold text-white shadow-[0_3px_0_#95301c] transition-all hover:-translate-y-0.5 hover:bg-[#be3f23]"
                >
                  立即排一篇
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/templates"
                  className="inline-flex h-13 items-center justify-center gap-2 rounded-md border border-[#aaa395] bg-[#fffdf8] px-7 font-semibold text-[#30322d] transition-colors hover:border-[#30322d]"
                >
                  先看版式
                </Link>
              </div>
              <p className="mt-4 text-xs text-[#85877e]">打开即可编辑，刷新后草稿仍保存在当前浏览器。</p>
            </div>

            <div className="reveal reveal-delay-2 relative lg:pl-4">
              <div className="ink-shadow overflow-hidden rounded-lg border border-[#272923] bg-[#fffdf8]">
                <div className="flex h-11 items-center justify-between border-b border-[#ddd6c8] bg-[#f1ece1] px-4">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#d64b2a]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#d1a84d]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#607460]" />
                  </div>
                  <span className="text-[11px] tracking-[0.18em] text-[#777970]">墨刻创作台</span>
                  <span className="text-[11px] text-[#657066]">已保存</span>
                </div>
                <div className="grid min-h-[420px] grid-cols-[82px_1fr] sm:grid-cols-[138px_1fr_190px]">
                  <div className="border-r border-[#e2dccf] bg-[#f6f2e9] p-3">
                    <p className="mb-3 text-[10px] font-semibold text-[#777970]">版式</p>
                    {["留白", "刊物", "新绿", "夜读"].map((style, index) => (
                      <div
                        key={style}
                        className={
                          index === 1
                            ? "mb-2 rounded border border-[#b35643] bg-white p-2 text-[10px] font-semibold text-[#9d3d2b]"
                            : "mb-2 rounded border border-transparent p-2 text-[10px] text-[#777970]"
                        }
                      >
                        {style}
                      </div>
                    ))}
                  </div>
                  <div className="paper-texture p-4 sm:p-7">
                    <div className="mx-auto min-h-[350px] max-w-sm border border-[#ded8cc] bg-white px-5 py-7 shadow-sm">
                      <p className="mb-3 text-[9px] tracking-[0.2em] text-[#a44935]">VOL. 08 · 创作手记</p>
                      <h2 className="font-display text-xl font-bold leading-snug text-[#292b27] sm:text-2xl">
                        好的排版，
                        <br />
                        是让文字被看见
                      </h2>
                      <div className="my-5 h-px w-12 bg-[#a44935]" />
                      <p className="text-[10px] leading-5 text-[#5f625b] sm:text-xs sm:leading-6">
                        读者不会因为装饰留下来，却可能因为拥挤而离开。适度的留白，是内容给读者的一次呼吸。
                      </p>
                      <blockquote className="my-5 border-l-2 border-[#a44935] bg-[#f7f2ea] px-3 py-2 text-[9px] leading-5 text-[#6e655e] sm:text-[11px]">
                        形式不该抢走内容的声音。
                      </blockquote>
                      <div className="space-y-2">
                        <div className="h-1.5 w-full rounded bg-[#ebe7df]" />
                        <div className="h-1.5 w-11/12 rounded bg-[#ebe7df]" />
                        <div className="h-1.5 w-4/5 rounded bg-[#ebe7df]" />
                      </div>
                    </div>
                  </div>
                  <div className="hidden border-l border-[#e2dccf] bg-[#ece7dd] p-4 sm:block">
                    <p className="mb-3 text-[10px] font-semibold text-[#777970]">手机预览</p>
                    <div className="rounded-[22px] bg-[#252722] p-2 shadow-lg">
                      <div className="min-h-[315px] rounded-[16px] bg-white px-4 py-7">
                        <div className="mx-auto mb-5 h-1 w-12 rounded bg-[#dedbd4]" />
                        <p className="font-display text-sm font-bold leading-5">好的排版，是让文字被看见</p>
                        <div className="my-3 h-px w-7 bg-[#a44935]" />
                        <p className="text-[8px] leading-4 text-[#696b64]">
                          读者不会因为装饰留下来，却可能因为拥挤而离开。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-7 -left-3 hidden rotate-[-4deg] border border-[#cfc6b7] bg-[#fffdf8] px-4 py-3 shadow-md sm:block">
                <span className="font-display text-sm font-bold text-[#b23d24]">所见即所得</span>
                <span className="ml-2 text-[10px] text-[#777970]">电脑写 · 手机看</span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#d9d2c4] bg-[#e9e2d4]/70">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-[#d2cabb] sm:grid-cols-4 sm:divide-y-0">
            {promises.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-center gap-2.5 px-3 py-5 text-xs font-semibold text-[#575a52] sm:text-sm">
                  <Icon className="h-4 w-4 text-[#b54126]" />
                  {item.label}
                </div>
              );
            })}
          </div>
        </section>

        <section className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="mb-3 text-xs font-bold tracking-[0.24em] text-[#b13b22]">一条完整的发布路径</p>
                <h2 className="font-display text-4xl font-bold text-[#20221e] sm:text-5xl">少一点设置，多一点写作</h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-[#696c63]">
                不需要先理解模板系统、品牌资产或工作流。打开创作台，从你的文章开始。
              </p>
            </div>
            <div className="grid gap-px overflow-hidden border border-[#cbc3b4] bg-[#cbc3b4] md:grid-cols-3">
              {steps.map((step) => (
                <article key={step.number} className="group bg-[#fffdf8] p-7 transition-colors hover:bg-white sm:p-9">
                  <div className="mb-12 flex items-center justify-between">
                    <span className="font-display text-4xl font-bold text-[#d7cec0] transition-colors group-hover:text-[#d64b2a]">{step.number}</span>
                    {step.number === "01" && <Feather className="h-5 w-5 text-[#8b8e85]" />}
                    {step.number === "02" && <LayoutTemplate className="h-5 w-5 text-[#8b8e85]" />}
                    {step.number === "03" && <MousePointer2 className="h-5 w-5 text-[#8b8e85]" />}
                  </div>
                  <h3 className="mb-3 font-display text-2xl font-bold">{step.title}</h3>
                  <p className="text-sm leading-7 text-[#696c63]">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#252722] px-6 py-20 text-[#f5f1e8] sm:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="mb-3 text-xs font-bold tracking-[0.24em] text-[#dd765d]">五种克制的基础版式</p>
                <h2 className="font-display text-4xl font-bold sm:text-5xl">让风格服务内容</h2>
              </div>
              <Link href="/templates" className="inline-flex items-center gap-2 text-sm text-[#d9d5cb] hover:text-white">
                查看全部版式
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {styleSamples.map((style, index) => (
                <Link
                  key={style.name}
                  href={"/editor?style=" + ["minimal-bw", "magazine", "lively", "academic", "night-reading"][index]}
                  className="group border border-white/10 bg-[#30322d] p-3 transition-transform hover:-translate-y-1"
                >
                  <div className="mb-4 aspect-[4/5] bg-[#fffdf8] p-4">
                    <div className="mb-5 flex gap-1">
                      {style.colors.map((color) => (
                        <span key={color} className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                    <div className="mb-3 h-1.5 w-8" style={{ backgroundColor: style.accent }} />
                    <p className="font-display text-lg font-bold text-[#292b27]">{style.name}</p>
                    <div className="mt-5 space-y-2">
                      <div className="h-1 w-full bg-[#e5e0d7]" />
                      <div className="h-1 w-10/12 bg-[#e5e0d7]" />
                      <div className="h-1 w-11/12 bg-[#e5e0d7]" />
                    </div>
                    <div className="mt-5 border-l-2 px-2 py-1.5" style={{ borderColor: style.accent, backgroundColor: style.colors[1] }}>
                      <div className="h-1 w-4/5 bg-black/20" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-1 pb-1">
                    <span className="font-display text-lg font-bold">{style.name}</span>
                    <span className="text-[10px] text-[#9fa098]">{style.scene}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="paper-texture px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl border-y border-[#cfc6b7] py-14 text-center">
            <Sparkles className="mx-auto mb-5 h-6 w-6 text-[#c14225]" />
            <p className="mb-4 text-xs font-bold tracking-[0.26em] text-[#a83a22]">免费，不等于做一半</p>
            <h2 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
              不注册、不限篇数、不加水印
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#666960]">
              墨刻的排版、预览、标题灵感和导出能力全部开放。我们不声称预测阅读量，也不会把本地规则包装成昂贵的 AI。
            </p>
            <Link
              href="/editor"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-md bg-[#1f211d] px-7 font-semibold text-white transition-colors hover:bg-[#393c35]"
            >
              打开创作台
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
