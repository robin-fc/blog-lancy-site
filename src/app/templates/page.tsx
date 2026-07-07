'use client'

import { useState, useMemo } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  LayoutTemplate, 
  Search, 
  Filter, 
  Eye, 
  Heart, 
  Star, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  Sparkles,
  Check,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

// 模拟模板数据
const mockTemplates = [
  { id: 't1', name: '科技周报', category: '科技互联网', industry: '科技', scene: '周报', structure: '列表式', useCount: 1280, readIncrease: 18, isPro: false, rating: 4.8 },
  { id: 't2', name: '产品发布', category: '活动通知', industry: '通用', scene: '产品', structure: '图文混排', useCount: 856, readIncrease: 25, isPro: true, rating: 4.9 },
  { id: 't3', name: '生活随笔', category: '日常推文', industry: '生活', scene: '日常', structure: '自由排版', useCount: 2340, readIncrease: 12, isPro: false, rating: 4.7 },
  { id: 't4', name: '年终总结', category: '节日祝福', industry: '通用', scene: '节日', structure: '图文混排', useCount: 1890, readIncrease: 30, isPro: false, rating: 4.6 },
  { id: 't5', name: '教程指南', category: '教育培训', industry: '教育', scene: '教程', structure: '步骤式', useCount: 1560, readIncrease: 22, isPro: false, rating: 4.8 },
  { id: 't6', name: '品牌故事', category: '文旅生活', industry: '文旅', scene: '品牌', structure: '叙事式', useCount: 670, readIncrease: 35, isPro: true, rating: 4.9 },
  { id: 't7', name: '美食分享', category: '日常推文', industry: '美食', scene: '分享', structure: '图文混排', useCount: 1890, readIncrease: 20, isPro: false, rating: 4.5 },
  { id: 't8', name: '行业洞察', category: '商业分析', industry: '金融', scene: '分析', structure: '列表式', useCount: 920, readIncrease: 28, isPro: true, rating: 4.7 },
  { id: 't9', name: '育儿心得', category: '日常推文', industry: '亲子', scene: '分享', structure: '自由排版', useCount: 2100, readIncrease: 15, isPro: false, rating: 4.6 },
  { id: 't10', name: '医疗科普', category: '医疗健康', industry: '医疗', scene: '科普', structure: '图文混排', useCount: 780, readIncrease: 32, isPro: true, rating: 4.8 },
]

const categories = [
  { key: 'all', label: '全部', count: mockTemplates.length },
  { key: '科技互联网', label: '科技互联网', count: mockTemplates.filter(t => t.category === '科技互联网').length },
  { key: '日常推文', label: '日常推文', count: mockTemplates.filter(t => t.category === '日常推文').length },
  { key: '教育培训', label: '教育培训', count: mockTemplates.filter(t => t.category === '教育培训').length },
  { key: '活动通知', label: '活动通知', count: mockTemplates.filter(t => t.category === '活动通知').length },
  { key: '医疗健康', label: '医疗健康', count: mockTemplates.filter(t => t.category === '医疗健康').length },
]

const sorts = [
  { key: 'hot', label: '最热门', icon: TrendingUp },
  { key: 'new', label: '最新', icon: Clock },
  { key: 'rating', label: '评分最高', icon: Star },
]

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeSort, setActiveSort] = useState('hot')
  const [proOnly, setProOnly] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null)

  const filteredTemplates = useMemo(() => {
    let result = [...mockTemplates]
    
    // 搜索过滤
    if (searchQuery) {
      result = result.filter(t => 
        t.name.includes(searchQuery) || t.category.includes(searchQuery)
      )
    }
    
    // 分类过滤
    if (activeCategory !== 'all') {
      result = result.filter(t => t.category === activeCategory)
    }
    
    // Pro 过滤
    if (proOnly) {
      result = result.filter(t => t.isPro)
    }
    
    // 排序
    switch (activeSort) {
      case 'hot':
        result.sort((a, b) => b.useCount - a.useCount)
        break
      case 'new':
        result.sort((a, b) => b.id.localeCompare(a.id))
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
    }
    
    return result
  }, [searchQuery, activeCategory, activeSort, proOnly])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-10">
          {/* 标题 */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">模板市场</h1>
            <p className="text-gray-500 text-sm">精选行业模板，一键套用，快速出稿</p>
          </div>

          {/* 搜索和筛选栏 */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
            {/* 搜索框 */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索模板名称或分类..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 排序 */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {sorts.map((sort) => {
                const Icon = sort.icon
                return (
                  <button
                    key={sort.key}
                    onClick={() => setActiveSort(sort.key)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                      activeSort === sort.key 
                        ? 'bg-white shadow-sm text-gray-900' 
                        : 'text-gray-500 hover:text-gray-700'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {sort.label}
                  </button>
                )
              })}
            </div>

            {/* Pro 筛选 */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={proOnly}
                onChange={(e) => setProOnly(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">仅 Pro 模板</span>
            </label>
          </div>

          {/* 分类标签 */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                  activeCategory === cat.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
                )}
              >
                {cat.label}
                <span className={cn(
                  'ml-1.5 text-xs',
                  activeCategory === cat.key ? 'text-blue-200' : 'text-gray-400'
                )}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* 模板网格 */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredTemplates.map((template) => (
              <Card 
                key={template.id}
                className="overflow-hidden group hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setPreviewTemplate(template.id)}
              >
                {/* 缩略图 */}
                <div className="aspect-[3/4] bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
                  {/* 模拟排版预览 */}
                  <div className="absolute inset-4">
                    <div className="w-1/3 h-2 bg-gray-200 rounded mb-3" />
                    <div className="w-full h-20 bg-gray-100 rounded mb-3" />
                    <div className="w-full h-2 bg-gray-100 rounded mb-1.5" />
                    <div className="w-full h-2 bg-gray-100 rounded mb-1.5" />
                    <div className="w-3/4 h-2 bg-gray-100 rounded mb-3" />
                    <div className="w-1/2 h-2 bg-gray-200 rounded mb-2" />
                    <div className="w-full h-2 bg-gray-100 rounded mb-1.5" />
                    <div className="w-5/6 h-2 bg-gray-100 rounded" />
                  </div>
                  
                  {/* Pro 标签 */}
                  {template.isPro && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-medium rounded-full">
                      PRO
                    </div>
                  )}
                  
                  {/* 悬浮操作层 */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <Button size="sm" className="gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      预览
                    </Button>
                    <Button size="sm" variant="secondary" className="gap-1">
                      <Check className="w-3.5 h-3.5" />
                      使用模板
                    </Button>
                  </div>
                </div>

                {/* 信息区 */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-amber-500">
                      <Star className="w-3 h-3 fill-current" />
                      {template.rating}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                    <span>{template.category}</span>
                    <span>·</span>
                    <span>{template.structure}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Eye className="w-3 h-3" />
                      {template.useCount.toLocaleString()} 次使用
                    </span>
                    <span className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      +{template.readIncrease}%
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* 空状态 */}
          {filteredTemplates.length === 0 && (
            <div className="text-center py-16">
              <LayoutTemplate className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400">未找到匹配的模板</p>
            </div>
          )}
        </div>
      </main>

      {/* 预览弹窗 */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-auto relative">
            <button
              onClick={() => setPreviewTemplate(null)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">模板预览</h2>
              <div className="aspect-[3/4] bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-4" />
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
                  关闭
                </Button>
                <Button className="gap-2">
                  <Check className="w-4 h-4" />
                  使用此模板
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  )
}