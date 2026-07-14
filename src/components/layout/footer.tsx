import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#1f211d] text-[#d7d3c9]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#d64b2a] font-display text-lg text-white">
              墨
            </span>
            <span className="font-display text-xl font-bold tracking-widest text-white">墨刻</span>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#aaa9a1]">
            一个诚实、轻量的公众号排版工具。没有套餐墙，不上传你的文章，也不替内容制造虚假的成功承诺。
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 text-sm sm:items-end">
          <nav className="flex gap-5">
            <Link href="/editor" className="hover:text-white">创作台</Link>
            <Link href="/title-generator" className="hover:text-white">标题灵感</Link>
            <Link href="/templates" className="hover:text-white">版式样本</Link>
          </nav>
          <p className="flex items-center gap-1.5 text-xs text-[#85877f]">
            <ShieldCheck className="h-3.5 w-3.5" />
            内容默认只保存在当前浏览器
          </p>
        </div>
      </div>
    </footer>
  );
}
