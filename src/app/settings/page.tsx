'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  User,
  Bell,
  CreditCard,
  Shield,
  Palette,
  Key,
  LogOut,
  Check,
  ExternalLink,
  AlertCircle,
  Copy,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const sections = [
  { id: 'profile', label: '个人信息', icon: User },
  { id: 'notifications', label: '通知设置', icon: Bell },
  { id: 'subscription', label: '订阅管理', icon: CreditCard },
  { id: 'security', label: '账号安全', icon: Shield },
  { id: 'appearance', label: '外观设置', icon: Palette },
  { id: 'api', label: 'API 密钥', icon: Key },
]

export default function SettingsPage() {
  const [active, setActive] = useState('profile')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">设置</h1>

        <div className="flex gap-6">
          {/* 左侧导航 */}
          <nav className="w-56 shrink-0 space-y-1">
            {sections.map((s) => {
              const Icon = s.icon
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-left',
                    active === s.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {s.label}
                </button>
              )
            })}
            <hr className="my-3" />
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
              <LogOut className="w-4 h-4" />
              退出登录
            </button>
          </nav>

          {/* 右侧内容 */}
          <main className="flex-1">
            {active === 'profile' && (
              <Card className="p-6">
                <h2 className="font-semibold text-lg mb-6">个人信息</h2>
                <div className="space-y-5">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                      U
                    </div>
                    <div>
                      <Button variant="outline" size="sm">更换头像</Button>
                      <p className="text-xs text-gray-400 mt-1">支持 JPG、PNG，最大 2MB</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">昵称</label>
                      <Input placeholder="输入昵称" defaultValue="用户" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">邮箱</label>
                      <Input type="email" placeholder="输入邮箱" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">手机号</label>
                      <Input type="tel" placeholder="输入手机号" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">所属行业</label>
                      <select className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm">
                        <option>请选择</option>
                        <option>科技互联网</option>
                        <option>教育培训</option>
                        <option>金融财经</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? '保存中...' : '保存修改'}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {active === 'notifications' && (
              <Card className="p-6">
                <h2 className="font-semibold text-lg mb-6">通知设置</h2>
                <div className="space-y-4">
                  {[
                    { label: 'AI 功能更新', desc: '新功能和优化更新提醒', checked: true },
                    { label: '文章自动保存', desc: '文章保存成功后通知', checked: true },
                    { label: '产品公告', desc: '重要产品变更通知', checked: true },
                    { label: '营销邮件', desc: '优惠活动信息', checked: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <div className="font-medium text-sm">{item.label}</div>
                        <div className="text-xs text-gray-400">{item.desc}</div>
                      </div>
                      <label className="relative inline-flex cursor-pointer">
                        <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                        <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {active === 'subscription' && (
              <Card className="p-6">
                <h2 className="font-semibold text-lg mb-4">当前方案</h2>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">免费版</span>
                  <Button size="sm">升级 Pro</Button>
                </div>
                <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-100">
                  <div>
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-xs text-gray-400">本月文章</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">47</div>
                    <div className="text-xs text-gray-400">AI 次数</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">2 天</div>
                    <div className="text-xs text-gray-400">额度重置</div>
                  </div>
                </div>
              </Card>
            )}

            {active === 'security' && (
              <Card className="p-6">
                <h2 className="font-semibold text-lg mb-6">账号安全</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <div className="font-medium text-sm">登录密码</div>
                      <div className="text-xs text-gray-400">已设置</div>
                    </div>
                    <Button variant="outline" size="sm">修改</Button>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <div className="font-medium text-sm">两步验证</div>
                      <div className="text-xs text-gray-400">未开启</div>
                    </div>
                    <Button variant="outline" size="sm">开启</Button>
                  </div>
                </div>
              </Card>
            )}

            {active === 'appearance' && (
              <Card className="p-6">
                <h2 className="font-semibold text-lg mb-6">外观设置</h2>
                <div className="space-y-5">
                  <div>
                    <div className="font-medium text-sm mb-3">主题</div>
                    <div className="flex gap-3">
                      {['浅色', '深色', '跟随系统'].map((t, i) => (
                        <button
                          key={t}
                          className={cn(
                            'px-4 py-2 rounded-lg border text-sm',
                            i === 0 ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <div className="font-medium text-sm mb-3">语言</div>
                    <select className="h-10 px-3 rounded-lg border border-gray-300 text-sm">
                      <option>简体中文</option>
                      <option>English</option>
                    </select>
                  </div>
                </div>
              </Card>
            )}

            {active === 'api' && (
              <Card className="p-6">
                <h2 className="font-semibold text-lg mb-2">API 密钥</h2>
                <p className="text-sm text-gray-500 mb-6">
                  使用 API 集成到你的工作流
                  <a href="#" className="text-blue-600 ml-1 inline-flex items-center">
                    查看文档 <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-5 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <div className="text-sm text-amber-800">
                    API 密钥仅在创建时显示一次，请妥善保存。
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="font-mono text-sm">sk-••••••••••••••••</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Copy className="w-3.5 h-3.5" />
                      复制
                    </Button>
                    <Button variant="outline" size="sm">重新生成</Button>
                  </div>
                </div>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}