'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Sparkles, RefreshCw, Copy, Check, Shield, TrendingUp, Heart, Star, Filter, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface TitleResult {
  id: string
  title: string
  type: string
  typeLabel: string
  clickRateScore: number
  riskLevel: 'low' | 'medium' | 'high'
  emotionTag: string
  emotionLabel: string
  isFavorite?: boolean
}

const titleTypes = [
  { key: 'pain-point', label: '痛点型', emoji: '🎯', desc: '直击用户痛点' },
  { key: 'number', label: '数字型', emoji: '🔢', desc: '数据更具说服力' },
  { key: 'suspense', label: '悬念型', emoji: '❓', desc: '引发好奇心' },
  { key: 'counter-intuitive', label: '反常识型', emoji: '💡', desc: '颠覆认知' },
  { key: 'trending', label: '热点型', emoji: '🔥', desc: '蹭热点引流' },
  { key: 'emotional', label: '情感型', emoji: '❤️', desc: '引发共鸣' },
]

// 模拟标题生成函数
function generateMockTitles(content: string): TitleResult[] {
  const baseTitles = [
    { title: '为什么你的公众号没人看？这 3 个错误 90% 的人都犯了', type: 'pain-point', typeLabel: '痛点型', clickRateScore: 87, emotionLabel: '焦虑' },
    { title: '7 个技巧让你的阅读量翻倍（亲测有效）', type: 'number', typeLabel: '数字型', clickRateScore: 72, emotionLabel: '期待' },
    { title: '我删了这篇文章 5 次，第 6 次终于发出去了', type: 'suspense', typeLabel: '悬念型', clickRateScore: 91, emotionLabel: '好奇' },
    { title: '别再写长文了，短文才是公众号的未来', type: 'counter-intuitive', typeLabel: '反常识型', clickRateScore: 78, emotionLabel: '颠覆' },
    { title: '从今天的热点看公众号运营的 4 个真相', type: 'trending', typeLabel: '热点型', clickRateScore: 65, emotionLabel: '关注' },
    { title: '写给每一个深夜还在写公众号的你', type: 'emotional', typeLabel: '情感型', clickRateScore: 83, emotionLabel: '共鸣' },
  ]
  
  return baseTitles.map((t, i) => ({
    id: String(i + 1),
    ...t,
    riskLevel: t.clickRateScore > 85 ? 'low' : t.clickRateScore > 70 ? 'medium' : 'high',
    emotionTag: 'neutral',
    isFavorite: false,
  }))
}

export default function TitleGeneratorPage() {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [titles, setTitles] = useState<TitleResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const filteredTitles = useMemo(() => {
    let result = titles
    if (filterType) {
      result = result.filter(t => t.type === filterType)
    }
    return result
  }, [titles, filterType])

  const handleGenerate = async () => {
    if (!content.trim()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    const newTitles = generateMockTitles(content)
    setTitles(newTitles)
    setLoading(false)
    setSelectedId(null)
  }

  const handleRegenerate = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    // 随机调整分数模拟重新生成
    setTitles(prev => prev.map(t => ({
      ...t,
      clickRateScore: Math.min(99, Math.max(40, t.clickRateScore + Math.floor(Math.random() * 20 - 10))),
    })))
    setLoading(false)
  }

  const handleCopy = async (title: string, id: string) => {
    await navigator.clipboard.writeText(title)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleUseInEditor = (title: string) => {
    // 实际项目中会保存到全局状态并跳转
    router.push(`/editor?title=${encodeURIComponent(title)}`)
  }

  const riskColors = {
    low: 'text-green-600 bg-green-50 border-green-200',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    high: 'text-red-600 bg-red-50 border-red-200',
  }

  const riskLabels = {
    low: '低风险',
    medium: '中风险',
    high: '高风险',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI 标题生成器</h1>
          <p className="text-gray-500">粘贴文章内容，AI 从 6 个维度生成爆款标题</p>
        </div>

        {/* 输入区 */}
        <Card className="p-5 mb-6">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="粘贴文章正文或摘要...至少输入 50 字效果更佳"
            className="min-h-[140px] mb-3 resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">{content.length} 字 {content.length < 50 && content.length > 0 && '(建议 50 字以上)'}</span>
            <div className="flex items-center gap-2">
              {titles.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={loading}>
                  <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
                  重新生成
                </Button>
              )}
              <Button onClick={handleGenerate} disabled={loading || !content.trim() || content.length < 10} className="gap-2">
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? '生成中...' : '生成标题'}
              </Button>
            </div>
          </div>
        </Card>

        {/* 类型筛选 */}
        {titles.length > 0 && (
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
            <span className="text-sm text-gray-500 shrink-0">筛选:</span>
            <button
              onClick={() => setFilterType(null)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium transition-colors shrink-0',
                !filterType ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              全部 ({titles.length})
            </button>
            {titleTypes.map((type) => {
              const count = titles.filter(t => t.type === type.key).length
              return (
                <button
                  key={type.key}
                  onClick={() => setFilterType(type.key)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium transition-colors shrink-0 flex items-center gap-1',
                    filterType === type.key ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  <span>{type.emoji}</span>
                  {type.label} ({count})
                </button>
              )
            })}
          </div>
        )}

        {/* 标题列表 */}
        {filteredTitles.length > 0 && (
          <div className="space-y-3">
            {filteredTitles.map((item, index) => (
              <Card
                key={item.id}
                className={cn(
                  'p-4 cursor-pointer transition-all hover:shadow-md',
                  selectedId === item.id && 'ring-2 ring-blue-500 bg-blue-50'
                )}
                onClick={() => setSelectedId(item.id)}
              >
                <div className="flex items-start gap-4">
                  {/* 排名序号 */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* 标签行 */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                        {item.typeLabel}
                      </span>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium', riskColors[item.riskLevel])}>
                        <Shield className="w-3 h-3 inline mr-0.5" />
                        {riskLabels[item.riskLevel]}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-medium">
                        <Heart className="w-3 h-3 inline mr-0.5" />
                        {item.emotionLabel}
                      </span>
                    </div>

                    {/* 标题文本 */}
                    <p className="text-base font-medium text-gray-900 leading-relaxed">{item.title}</p>
                  </div>

                  {/* 右侧操作区 */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {/* 预估点击率分数 */}
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      <div className="text-center">
                        <span className={cn(
                          'text-lg font-bold',
                          item.clickRateScore >= 85 ? 'text-green-600' : item.clickRateScore >= 70 ? 'text-blue-600' : 'text-gray-500'
                        )}>
                          {item.clickRateScore}
                        </span>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id) }}
                        className={cn(
                          'p-1.5 rounded-md hover:bg-gray-100 transition-colors',
                          favorites.has(item.id) && 'text-yellow-500'
                        )}
                      >
                        <Star className={cn('w-4 h-4', favorites.has(item.id) && 'fill-current')} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCopy(item.title, item.id) }}
                        className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        {copiedId === item.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleUseInEditor(item.title) }}
                        className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-blue-600"
                        title="在编辑器中使用"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* 空状态 */}
        {titles.length === 0 && !loading && (
          <div className="text-center py-16 text-gray-400">
            <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>粘贴文章内容，AI 将为你生成 6 个维度的爆款标题</p>
          </div>
        )}
      </div>
    </div>
  )
}