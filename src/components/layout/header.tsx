'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import { useArticlesStore } from '@/store/articles'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Wand2, 
  ImagePlus, 
  LayoutTemplate, 
  Palette,
  LayoutDashboard,
  Settings,
  LogOut,
  User,
  CreditCard,
  ChevronDown,
  Plus,
  Menu,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/editor', label: '编辑器', icon: FileText },
  { href: '/title-generator', label: 'AI 标题', icon: Wand2 },
  { href: '/image-generator', label: 'AI 配图', icon: ImagePlus },
  { href: '/templates', label: '模板市场', icon: LayoutTemplate },
  { href: '/styles', label: '风格中心', icon: Palette },
]

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { createArticle } = useArticlesStore()
  
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  
  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCreateArticle = () => {
    const id = createArticle()
    router.push(`/editor?id=${id}`)
  }

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    router.push('/')
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900">BlogAI</span>
        </Link>

        {/* 桌面导航 */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* 右侧操作区 */}
        <div className="flex items-center gap-3">
          {/* 创建按钮 */}
          <Button
            onClick={handleCreateArticle}
            className="gap-1.5 hidden sm:flex"
          >
            <Plus className="w-4 h-4" />
            新建文章
          </Button>

          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              {/* 用户头像按钮 */}
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
              </button>

              {/* 用户下拉菜单 */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2">
                  {/* 用户信息 */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="font-medium text-gray-900">{user?.name}</div>
                    <div className="text-sm text-gray-500">{user?.email}</div>
                    <div className="mt-1.5">
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        user?.plan === 'pro' ? 'bg-purple-100 text-purple-700' :
                        user?.plan === 'team' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      )}>
                        {user?.plan === 'pro' ? 'Pro 会员' : 
                         user?.plan === 'team' ? 'Team 会员' : '免费版'}
                      </span>
                    </div>
                  </div>

                  {/* 菜单项 */}
                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      工作台
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4" />
                      设置
                    </Link>
                    <Link
                      href="/pricing"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <CreditCard className="w-4 h-4" />
                      升级套餐
                    </Link>
                  </div>

                  {/* 退出登录 */}
                  <div className="border-t border-gray-100 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 w-full text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      退出登录
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">登录</Button>
            </Link>
          )}

          {/* 移动端菜单按钮 */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 移动端菜单 */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-6 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium',
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
            <hr className="my-2" />
            <button
              onClick={() => {
                handleCreateArticle()
                setShowMobileMenu(false)
              }}
              className="flex items-center gap-2 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              <Plus className="w-4 h-4" />
              新建文章
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}