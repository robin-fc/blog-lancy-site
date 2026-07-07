import Link from 'next/link'
import { PenLine, Sparkles, ImageIcon, LayoutTemplate, Palette } from 'lucide-react'

const quickLinks = [
  { href: '/editor', label: '新建文章', icon: PenLine },
  { href: '/title-generator', label: 'AI 标题', icon: Sparkles },
  { href: '/image-generator', label: 'AI 配图', icon: ImageIcon },
  { href: '/templates', label: '浏览模板', icon: LayoutTemplate },
  { href: '/styles', label: '我的风格', icon: Palette },
]

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">
              <span className="text-blue-600">✦</span> 墨刻
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              AI 驱动的公众号风格优化平台<br />
              从文字到爆款，一站式搞定
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">产品功能</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-gray-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">支持与帮助</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><span className="hover:text-gray-900 cursor-pointer transition-colors">使用教程</span></li>
              <li><span className="hover:text-gray-900 cursor-pointer transition-colors">常见问题</span></li>
              <li><span className="hover:text-gray-900 cursor-pointer transition-colors">反馈建议</span></li>
              <li><span className="hover:text-gray-900 cursor-pointer transition-colors">API 文档</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">关于</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><span className="hover:text-gray-900 cursor-pointer transition-colors">关于我们</span></li>
              <li><span className="hover:text-gray-900 cursor-pointer transition-colors">隐私政策</span></li>
              <li><span className="hover:text-gray-900 cursor-pointer transition-colors">服务条款</span></li>
              <li><span className="hover:text-gray-900 cursor-pointer transition-colors">联系我们</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
          © 2026 墨刻 — AI 公众号风格优化平台
        </div>
      </div>
    </footer>
  )
}
