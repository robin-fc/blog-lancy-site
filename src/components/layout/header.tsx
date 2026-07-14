"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/editor", label: "创作台" },
  { href: "/title-generator", label: "标题灵感" },
  { href: "/templates", label: "版式样本" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#1f211d]/95 text-[#fffdf8] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#d64b2a] font-display text-xl text-white shadow-[2px_2px_0_#772514] transition-transform group-hover:-rotate-3">
            墨
          </span>
          <span>
            <span className="block font-display text-xl font-bold leading-5 tracking-widest">墨刻</span>
            <span className="hidden text-[10px] tracking-[0.22em] text-[#bfc0b8] sm:block">免费公众号排版</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-4 py-2 text-sm transition-colors",
                  active ? "bg-white/10 text-white" : "text-[#c9cac2] hover:bg-white/5 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/editor"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#d64b2a] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#bf4024]"
          >
            免费排一篇
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "关闭菜单" : "打开菜单"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="rounded-md p-2 text-[#e6e2d8] hover:bg-white/10 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 px-4 py-4 md:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm text-[#e6e2d8] hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/editor"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-md bg-[#d64b2a] px-4 py-3 text-sm font-semibold text-white"
            >
              免费排一篇
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
