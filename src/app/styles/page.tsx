'use client'

import { Header } from '@/components/layout/header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { builtInStylePacks } from '@/lib/styles'
import { Palette, Edit2, Copy, Plus, Eye, Check, RefreshCw, Wand2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

// 示例内容用于预览
const sampleContent = `
<h1>示例文章标题</h1>
<p>这是正文内容示例。好的排版能让读者更容易理解和记住你的内容。</p>
<h2>一、排版的重要性</h2>
<p>排版不仅仅是让文章看起来好看，更重要的是提升阅读体验，让读者愿意读完你的文章。</p>
<blockquote>好的排版是无声的引导，它让读者不知不觉读完你的文章。</blockquote>
<h3>1. 视觉层次</h3>
<p>通过字体大小、颜色、间距建立清晰的视觉层次，引导读者视线。</p>
<h2>二、常见排版技巧</h2>
<p>使用短段落、适当留白、突出重点，这些都是提升排版效果的关键。</p>
`

export default function StylesPage() {
  const [selectedStyleId, setSelectedStyleId] = useState(builtInStylePacks[0].id)
  const [previewMode, setPreviewMode] = useState<'sample' | 'blank'>('sample')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const selectedStyle = builtInStylePacks.find(s => s.id === selectedStyleId)

  const handleCopy = async (styleId: string) => {
    const style = builtInStylePacks.find(s => s.id === styleId)
    if (!style) return
    await navigator.clipboard.writeText(JSON.stringify(style, null, 2))
    setCopiedId(styleId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const generateStyleCss = (style: typeof selectedStyle) => {
    if (!style) return ''
    return `
      body {
        font-family: ${style.typography.bodyFont};
        font-size: ${style.typography.bodySize};
        line-height: ${style.typography.lineHeight};
        color: ${style.colors.text};
        background: ${style.colors.background};
        padding: 20px 16px;
      }
      h1, h2, h3 { font-family: ${style.typography.headingFont}; margin-top: 1.5em; }
      h1 { font-size: ${style.typography.headingSizes[0]}; color: ${style.colors.primary}; text-align: center; margin-bottom: 1em; font-weight: 700; }
      h2 { font-size: ${style.typography.headingSizes[1]}; color: ${style.colors.primary}; border-left: 4px solid ${style.colors.accent}; padding-left: 12px; }
      h3 { font-size: ${style.typography.headingSizes[2]}; color: ${style.colors.secondary}; }
      p { margin-bottom: ${style.spacing.paragraphGap}; text-align: justify; }
      blockquote {
        border-left: 3px solid ${style.colors.primary};
        background: rgba(0,0,0,0.02);
        padding: 12px 16px;
        margin: 1.5em 0;
        border-radius: 0 8px 8px 0;
        color: ${style.colors.secondary};
      }
      img { max-width: 100%; border-radius: ${style.imageTreatment.borderRadius}; }
    `
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">风格中心</h1>
            <p className="text-gray-500 text-sm">管理品牌风格包，让每篇文章统一风格</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            创建风格包
          </Button>
        </div>

        {/* 主布局：左侧列表 + 右侧预览 */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* 左侧：风格列表 */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-semibold text-gray-700 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              预设风格 ({builtInStylePacks.length})
            </h2>
            
            {builtInStylePacks.map((style) => {
              const isSelected = selectedStyleId === style.id
              return (
                <Card
                  key={style.id}
                  onClick={() => setSelectedStyleId(style.id)}
                  className={cn(
                    'p-4 cursor-pointer transition-all hover:shadow-md',
                    isSelected && 'ring-2 ring-blue-500 bg-blue-50'
                  )}
                >
                  <div className="flex items-center gap-4">
                    {/* 颜色预览 */}
                    <div className="flex-shrink-0">
                      <div className="flex gap-1">
                        <div
                          className="w-8 h-8 rounded-lg border border-gray-200"
                          style={{ backgroundColor: style.colors.primary }}
                        />
                        <div
                          className="w-8 h-8 rounded-lg border border-gray-200"
                          style={{ backgroundColor: style.colors.secondary }}
                        />
                        <div
                          className="w-8 h-8 rounded-lg border border-gray-200"
                          style={{ backgroundColor: style.colors.accent }}
                        />
                      </div>
                    </div>
                    
                    {/* 信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{style.name}</h3>
                        {style.isDefault && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded">
                            默认
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{style.description}</p>
                    </div>
                  </div>

                  {/* 详情 */}
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                    <span>正文 {style.typography.bodySize}</span>
                    <span>行高 {style.typography.lineHeight}</span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: style.colors.primary }} />
                      主色
                    </span>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <Edit2 className="w-3 h-3" />
                      编辑
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopy(style.id)
                      }}
                    >
                      {copiedId === style.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedId === style.id ? '已复制' : '复制'}
                    </Button>
                    {isSelected && (
                      <Button size="sm" className="flex-1 gap-1">
                        <Check className="w-3 h-3" />
                        应用
                      </Button>
                    )}
                  </div>
                </Card>
              )
            })}

            {/* 风格克隆入口 */}
            <Card className="p-5 border-dashed border-2 border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                  <Wand2 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">🪄 风格克隆</h3>
                  <p className="text-xs text-gray-500 mt-0.5">输入公众号文章 URL，AI 自动克隆视觉风格</p>
                </div>
              </div>
            </Card>
          </div>

          {/* 右侧：实时预览 */}
          <div className="lg:col-span-3">
            <Card className="sticky top-6">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-700 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  实时预览
                </h2>
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                  <button
                    onClick={() => setPreviewMode('sample')}
                    className={cn(
                      'px-3 py-1 text-xs rounded-md transition-colors',
                      previewMode === 'sample' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    )}
                  >
                    示例内容
                  </button>
                  <button
                    onClick={() => setPreviewMode('blank')}
                    className={cn(
                      'px-3 py-1 text-xs rounded-md transition-colors',
                      previewMode === 'blank' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    )}
                  >
                    空白
                  </button>
                </div>
              </div>

              {/* 手机预览框 */}
              <div className="p-6 bg-gray-100 flex justify-center">
                <div className="relative bg-black rounded-[2.5rem] p-2.5 shadow-xl">
                  {/* 刘海 */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-b-2xl z-10" />
                  
                  <div className="bg-white rounded-[2rem] overflow-hidden" style={{ width: 375 }}>
                    {/* 状态栏 */}
                    <div className="flex items-center justify-between px-7 py-2.5 bg-white text-[10px] text-gray-500">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <span>📶</span>
                        <span>🔋</span>
                      </div>
                    </div>
                    
                    {/* 内容区 */}
                    <iframe
                      srcDoc={`
                        <!DOCTYPE html>
                        <html>
                        <head>
                          <meta charset="utf-8" />
                          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                          <style>${generateStyleCss(selectedStyle)}</style>
                          <style>
                            body { margin: 0; }
                            * { max-width: 100%; }
                          </style>
                        </head>
                        <body>
                          ${previewMode === 'sample' ? sampleContent : '<p style="color: #999; text-align: center; padding: 60px 20px;">空白预览</p>'}
                        </body>
                        </html>
                      `}
                      className="w-full border-0"
                      style={{ height: 600 }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}