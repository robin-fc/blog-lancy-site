'use client'

import { Header } from '@/components/layout/header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PenLine, BarChart3, Clock, Eye, Zap, TrendingUp, Calendar, ChevronRight, FileText, Sparkles, Settings } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// 模拟数据
const mockArticles = [
  { id: '1', title: '为什么你的公众号没人看？', status: '已发布', readCount: 1280, likeCount: 89, date: '2026-04-20', style: '极简黑白' },
  { id: '2', title: '7 个技巧提升阅读量', status: '草稿', readCount: 0, likeCount: 0, date: '2026-04-22', style: '杂志风' },
  { id: '3', title: '写给深夜写公众号的你', status: '已发布', readCount: 3560, likeCount: 234, date: '2026-04-18', style: '夜读情感' },
  { id: '4', title: '公众号排版完全指南', status: '已发布', readCount: 892, likeCount: 45, date: '2026-04-15', style: '极简黑白' },
  { id: '5', title: 'AI 时代的创作思考', status: '草稿', readCount: 0, likeCount: 0, date: '2026-04-23', style: '未设置' },
]

const mockActivity = [
  { type: 'publish', text: '发布了文章「为什么你的公众号没人看？」', time: '2 小时前' },
  { type: 'ai', text: '使用一键排版优化了「7 个技巧提升阅读量」', time: '5 小时前' },
  { type: 'title', text: '为「公众号排版完全指南」生成了 6 个标题', time: '昨天' },
  { type: 'edit', text: '编辑了「写给深夜写公众号的你」', time: '2 天前' },
]

const quickActions = [
  { icon: PenLine, label: '新建文章', href: '/editor', color: 'bg-blue-500' },
  { icon: Sparkles, label: 'AI 标题', href: '/title-generator', color: 'bg-purple-500' },
  { icon: FileText, label: '模板市场', href: '/templates', color: 'bg-green-500' },
  { icon: Settings, label: '设置', href: '/settings', color: 'bg-gray-500' },
]

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d')

  const totalReads = mockArticles.filter(a => a.status === '已发布').reduce((sum, a) => sum + a.readCount, 0)
  const totalLikes = mockArticles.filter(a => a.status === '已发布').reduce((sum, a) => sum + a.likeCount, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* 欢迎语 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">欢迎回来 👋</h1>
          <p className="text-gray-500 text-sm mt-1">今天是 {new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* 快捷操作 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.label} href={action.href}>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{action.label}</span>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* 数据统计 */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { label: '总文章数', value: mockArticles.length, change: '+2 本周', icon: PenLine, color: 'bg-blue-100 text-blue-600' },
            { label: '本月阅读', value: totalReads.toLocaleString(), change: '+12%', icon: Eye, color: 'bg-green-100 text-green-600' },
            { label: 'AI 使用次数', value: '47/300', change: 'Pro 套餐', icon: Zap, color: 'bg-purple-100 text-purple-600' },
            { label: '平均互动率', value: '4.2%', change: '+0.8%', icon: TrendingUp, color: 'bg-orange-100 text-orange-600' },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{stat.change}</span>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
              </Card>
            )
          })}
        </div>

        {/* 主要内容区 */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* 文章列表 */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="font-semibold text-lg">最近文章</h2>
                <Link href="/editor" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  新建文章 <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              
              {mockArticles.map((article) => (
                <Link key={article.id} href={`/editor?id=${article.id}`}>
                  <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 cursor-pointer">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 truncate">{article.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span>{article.date}</span>
                        <span className={`px-1.5 py-0.5 rounded ${article.status === '已发布' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                          {article.status}
                        </span>
                        <span>{article.style}</span>
                      </div>
                    </div>
                    {article.status === '已发布' && (
                      <div className="flex items-center gap-4 text-sm text-gray-400 flex-shrink-0">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {article.readCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" />
                          {article.likeCount}
                        </span>
                      </div>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 ml-2" />
                  </div>
                </Link>
              ))}
            </Card>
          </div>

          {/* 右侧边栏 */}
          <div className="space-y-6">
            {/* AI 使用情况 */}
            <Card className="p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-500" />
                AI 使用情况
              </h3>
              <div className="space-y-3">
                {[
                  { label: '一键排版', used: 28, total: 300 },
                  { label: 'AI 标题', used: 12, total: 200 },
                  { label: 'AI 配图', used: 7, total: 100 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="text-gray-400">{item.used}/{item.total}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        style={{ width: `${(item.used / item.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/pricing">
                <Button variant="outline" size="sm" className="w-full mt-4">
                  升级套餐
                </Button>
              </Link>
            </Card>

            {/* 最近活动 */}
            <Card className="p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                最近活动
              </h3>
              <div className="space-y-3">
                {mockActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      item.type === 'publish' ? 'bg-green-400' :
                      item.type === 'ai' ? 'bg-purple-400' :
                      item.type === 'title' ? 'bg-amber-400' : 'bg-gray-300'
                    }`} />
                    <div className="min-w-0">
                      <p className="text-gray-600 truncate">{item.text}</p>
                      <p className="text-xs text-gray-400">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* 提示卡片 */}
            <Card className="p-5 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2">💡 小提示</h3>
              <p className="text-sm text-blue-700">
                使用「一键排版」可以快速应用专家级排版规则，平均提升 15% 阅读完成率。
              </p>
              <Link href="/editor">
                <Button size="sm" className="mt-3 w-full">
                  立即尝试
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}