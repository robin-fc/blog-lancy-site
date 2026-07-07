'use client'

import { builtInStylePacks } from '@/lib/styles'
import { cn } from '@/lib/utils'
import { Palette, Sparkles, ImageIcon, Wand2, RefreshCw, FileText, Copy, ChevronDown, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useState } from 'react'

interface EditorSidebarProps {
  selectedStyle: string
  onStyleChange: (styleId: string) => void
  onAIAction: (action: 'polish' | 'expand' | 'simplify' | 'format') => void
  aiLoading: string | null
}

export function EditorSidebar({ selectedStyle, onStyleChange, onAIAction, aiLoading }: EditorSidebarProps) {
  const [activePanel, setActivePanel] = useState<'tools' | 'styles' | 'assets'>('styles')
  const [expandedTool, setExpandedTool] = useState<string | null>(null)

  const panels = [
    { id: 'tools' as const, icon: Wand2, label: 'AI 工具' },
    { id: 'styles' as const, icon: Palette, label: '样式库' },
    { id: 'assets' as const, icon: ImageIcon, label: '素材库' },
  ]

  return (
    <aside className="w-72 border-r border-gray-200 bg-white flex flex-col">
      {/* 面板切换 */}
      <div className="flex border-b border-gray-200">
        {panels.map((panel) => {
          const Icon = panel.icon
          return (
            <button
              key={panel.id}
              onClick={() => setActivePanel(panel.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1 py-3 text-xs font-medium transition-colors',
                activePanel === panel.id
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:bg-gray-50'
              )}
            >
              <Icon className="w-4 h-4" />
              {panel.label}
            </button>
          )
        })}
      </div>

      {/* 面板内容 */}
      <div className="flex-1 overflow-auto p-4">
        {/* AI 工具面板 */}
        {activePanel === 'tools' && (
          <div className="space-y-4">
            <div className="space-y-2">
              {[
                { id: 'polish', icon: '✨', label: '智能润色', desc: '优化语句表达', action: 'polish' as const },
                { id: 'expand', icon: '📝', label: '内容扩写', desc: '补充论述说明', action: 'expand' as const },
                { id: 'simplify', icon: '🔪', label: '精简提炼', desc: '删除冗余内容', action: 'simplify' as const },
              ].map((tool) => (
                <div key={tool.id}>
                  <button
                    onClick={() => onAIAction(tool.action)}
                    disabled={aiLoading !== null}
                    className={cn(
                      'flex items-center gap-3 w-full p-3 rounded-lg border text-left transition-colors',
                      aiLoading === tool.action
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    )}
                  >
                    {aiLoading === tool.action ? (
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    ) : (
                      <span className="text-lg">{tool.icon}</span>
                    )}
                    <div>
                      <div className="font-medium text-sm">{tool.label}</div>
                      <div className="text-xs text-gray-400">{tool.desc}</div>
                    </div>
                  </button>
                </div>
              ))}
            </div>

            <hr className="my-4" />

            <Button
              onClick={() => onAIAction('format')}
              disabled={aiLoading !== null}
              className="w-full gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              {aiLoading === 'format' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              一键智能排版
            </Button>
            <p className="text-xs text-gray-400 text-center">应用当前风格，自动优化排版</p>
          </div>
        )}

        {/* 样式库面板 */}
        {activePanel === 'styles' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-500 mb-3">选择风格应用到当前文章</p>
            {builtInStylePacks.map((style) => {
              const isSelected = selectedStyle === style.id
              return (
                <Card
                  key={style.id}
                  onClick={() => onStyleChange(style.id)}
                  className={cn(
                    'p-3 cursor-pointer transition-all',
                    isSelected ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50' : 'hover:border-gray-300'
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex gap-1">
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: style.colors.primary }}
                      />
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: style.colors.secondary }}
                      />
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: style.colors.accent }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{style.name}</div>
                      {style.isDefault && (
                        <span className="text-[10px] px-1 py-0.5 bg-blue-100 text-blue-600 rounded">
                          默认
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 line-clamp-2">{style.description}</div>
                </Card>
              )
            })}
          </div>
        )}

        {/* 素材库面板 */}
        {activePanel === 'assets' && (
          <div className="space-y-4">
            <p className="text-xs text-gray-500">管理你的常用素材</p>
            
            <div>
              <h4 className="text-sm font-medium mb-2">图片素材</h4>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 cursor-pointer transition-colors"
                  >
                    <ImageIcon className="w-6 h-6 text-gray-300" />
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2 gap-1">
                <span>+</span>
                上传图片
              </Button>
            </div>

            <hr />

            <div>
              <h4 className="text-sm font-medium mb-2">常用引用</h4>
              <div className="space-y-2">
                <div className="p-2 bg-gray-50 rounded text-xs text-gray-500">
                  "好的排版是无声的引导"
                </div>
                <div className="p-2 bg-gray-50 rounded text-xs text-gray-500">
                  "内容为王，形式为后"
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}