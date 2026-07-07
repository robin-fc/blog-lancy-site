'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ImagePlus, 
  Sparkles, 
  Download, 
  RefreshCw, 
  Copy, 
  Check, 
  Wand2, 
  Palette,
  Square,
  Trash2,
  Star,
  Share2
} from 'lucide-react'
import { cn } from '@/lib/utils'

// 预设提示词模板
const promptTemplates = [
  { id: 't1', label: '科技感配图', prompt: 'futuristic technology illustration, neon blue and purple, clean minimal style, suitable for tech article' },
  { id: 't2', label: '商务场景', prompt: 'professional business meeting scene, modern office, soft lighting, corporate style' },
  { id: 't3', label: '自然风景', prompt: 'beautiful nature landscape, mountains and lake, golden hour lighting, peaceful atmosphere' },
  { id: 't4', label: '抽象艺术', prompt: 'abstract art illustration, vibrant colors, modern geometric shapes, creative design' },
  { id: 't5', label: '人物插画', prompt: 'flat illustration of person working on laptop, cozy home office, warm colors, friendly style' },
  { id: 't6', label: '数据可视化', prompt: 'clean data visualization illustration, charts and graphs, blue and white color scheme, modern infographic style' },
]

// 图片尺寸预设
const aspectRatios = [
  { id: '16:9', label: '横版封面', width: 1280, height: 720, desc: '公众号封面、头条图' },
  { id: '2.35:1', label: '公众号封面', width: 900, height: 383, desc: '公众号标准封面比例' },
  { id: '1:1', label: '方形图', width: 800, height: 800, desc: '分享图、缩略图' },
  { id: '3:4', label: '竖版图', width: 600, height: 800, desc: '小红书、朋友圈' },
  { id: '9:16', label: '竖版封面', width: 720, height: 1280, desc: '视频封面、故事' },
]

// 模拟已生成图片
const mockGeneratedImages = [
  { id: 'g1', prompt: '科技感配图', ratio: '16:9', createdAt: '10 分钟前', isFavorite: true },
  { id: 'g2', prompt: '商务场景', ratio: '1:1', createdAt: '1 小时前', isFavorite: false },
  { id: 'g3', prompt: '自然风景', ratio: '16:9', createdAt: '昨天', isFavorite: true },
]

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState('')
  const [selectedRatio, setSelectedRatio] = useState('16:9')
  const [generating, setGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState(mockGeneratedImages)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setGenerating(true)
    // 模拟生成
    await new Promise(r => setTimeout(r, 2500))
    setGeneratedImage(`/placeholder-generated-${Date.now()}.jpg`)
    setGenerating(false)
  }

  const handleApplyTemplate = (template: typeof promptTemplates[0]) => {
    setPrompt(template.prompt)
  }

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleFavorite = (id: string) => {
    setHistory(prev => prev.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">AI 配图生成器</h1>
          <p className="text-gray-500 text-sm">输入描述或选择模板，AI 为你生成匹配的配图</p>
        </div>

        {/* 主布局 */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* 左侧：设置区 */}
          <div className="lg:col-span-2 space-y-5">
            {/* 提示词输入 */}
            <Card className="p-5">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-purple-500" />
                图片描述
              </h3>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="描述你想要的图片，例如：一个程序员深夜在电脑前写代码的场景..."
                className="w-full h-32 rounded-lg border border-gray-300 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-400">{prompt.length} 字符</span>
                <Button variant="ghost" size="sm" className="gap-1" onClick={handleCopyPrompt}>
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? '已复制' : '复制'}
                </Button>
              </div>
            </Card>

            {/* 模板快选 */}
            <Card className="p-5">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                提示词模板
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {promptTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleApplyTemplate(template)}
                    className={cn(
                      'p-2.5 rounded-lg border text-left transition-all',
                      'hover:border-blue-300 hover:bg-blue-50',
                      prompt === template.prompt ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    )}
                  >
                    <div className="text-xs font-medium text-gray-700">{template.label}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5 truncate">{template.prompt.slice(0, 30)}...</div>
                  </button>
                ))}
              </div>
            </Card>

            {/* 尺寸选择 */}
            <Card className="p-5">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Square className="w-4 h-4 text-blue-500" />
                图片尺寸
              </h3>
              <div className="space-y-2">
                {aspectRatios.map((ratio) => (
                  <label
                    key={ratio.id}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all',
                      selectedRatio === ratio.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="ratio"
                        checked={selectedRatio === ratio.id}
                        onChange={() => setSelectedRatio(ratio.id)}
                        className="w-4 h-4"
                      />
                      <div>
                        <div className="text-sm font-medium">{ratio.label}</div>
                        <div className="text-xs text-gray-400">{ratio.desc}</div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{ratio.width}×{ratio.height}</span>
                  </label>
                ))}
              </div>
            </Card>

            {/* 生成按钮 */}
            <Button
              className="w-full h-12 gap-2 text-base"
              onClick={handleGenerate}
              disabled={generating || !prompt.trim()}
            >
              {generating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  生成图片
                </>
              )}
            </Button>
            <p className="text-xs text-center text-gray-400">
              今日已使用 7/10 次 · Pro 用户 100 次/月
            </p>
          </div>

          {/* 右侧：预览区 */}
          <div className="lg:col-span-3 space-y-5">
            {/* 生成结果 */}
            <Card className="p-5">
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <ImagePlus className="w-4 h-4 text-green-500" />
                生成结果
              </h3>
              
              <div className={cn(
                'rounded-lg overflow-hidden',
                aspectRatios.find(r => r.id === selectedRatio)?.height === 1280 
                  ? 'max-h-[500px]' 
                  : 'aspect-video'
              )}>
                {generating ? (
                  <div className="aspect-video bg-gray-100 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3" />
                    <p className="text-sm text-gray-400">AI 正在创作中...</p>
                  </div>
                ) : generatedImage ? (
                  <div className="relative group">
                    <div className="aspect-video bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
                      <div className="text-center">
                        <ImagePlus className="w-16 h-16 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">图片已生成</p>
                      </div>
                    </div>
                    {/* 悬浮操作层 */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <Button size="sm" variant="secondary" className="gap-1">
                        <Download className="w-4 h-4" />
                        下载
                      </Button>
                      <Button size="sm" variant="secondary" className="gap-1">
                        <Copy className="w-4 h-4" />
                        复制
                      </Button>
                      <Button size="sm" variant="secondary" className="gap-1">
                        <Share2 className="w-4 h-4" />
                        分享
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 flex flex-col items-center justify-center">
                    <ImagePlus className="w-12 h-12 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-400">输入描述后生成配图</p>
                  </div>
                )}
              </div>
            </Card>

            {/* 历史记录 */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Palette className="w-4 h-4 text-gray-400" />
                  最近生成
                </h3>
                <Button variant="ghost" size="sm" className="text-xs text-gray-400">
                  清空历史
                </Button>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {history.map((item) => (
                  <div key={item.id} className="group relative">
                    <div className="aspect-square rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200 flex items-center justify-center">
                      <ImagePlus className="w-6 h-6 text-gray-300" />
                    </div>
                    <div className="absolute inset-0 rounded-lg bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className={cn(
                          'p-1.5 rounded-full transition-colors',
                          item.isFavorite ? 'text-yellow-400' : 'text-white/70 hover:text-white'
                        )}
                      >
                        <Star className={cn('w-4 h-4', item.isFavorite && 'fill-current')} />
                      </button>
                      <button className="p-1.5 rounded-full text-white/70 hover:text-white">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-full text-white/70 hover:text-white">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 truncate">{item.prompt}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}