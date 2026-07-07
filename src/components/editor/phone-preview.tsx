'use client'

import { builtInStylePacks } from '@/lib/styles'

interface PhonePreviewProps {
  content: string
  styleId: string
}

export function PhonePreview({ content, styleId }: PhonePreviewProps) {
  const style = builtInStylePacks.find(s => s.id === styleId) || builtInStylePacks[0]

  const styleCss = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: ${style.typography.bodyFont};
      font-size: ${style.typography.bodySize};
      line-height: ${style.typography.lineHeight};
      color: ${style.colors.text};
      background: ${style.colors.background};
      padding: 16px 14px;
      -webkit-font-smoothing: antialiased;
    }
    h1, h2, h3 {
      font-family: ${style.typography.headingFont};
      margin-top: 1.4em;
    }
    h1 {
      font-size: ${style.typography.headingSizes[0]};
      color: ${style.colors.primary};
      text-align: center;
      margin-bottom: 0.8em;
      font-weight: 700;
    }
    h2 {
      font-size: ${style.typography.headingSizes[1]};
      color: ${style.colors.primary};
      border-left: 3px solid ${style.colors.accent};
      padding-left: 10px;
      margin-top: 1.6em;
    }
    h3 {
      font-size: ${style.typography.headingSizes[2]};
      color: ${style.colors.secondary};
    }
    p {
      margin-bottom: ${style.spacing.paragraphGap};
      text-align: justify;
    }
    blockquote {
      border-left: 3px solid ${style.colors.primary};
      background: ${style.colors.background === '#1A1A2E' ? 'rgba(255,255,255,0.05)' : '#f9fafb'};
      padding: 10px 14px;
      margin: 1.2em 0;
      color: ${style.colors.secondary};
      border-radius: 4px;
    }
    img { max-width: 100%; border-radius: ${style.imageTreatment.borderRadius}; display: block; }
    ul, ol { padding-left: 1.5em; margin-bottom: 1em; }
    li { margin-bottom: 0.3em; }
    a { color: ${style.colors.primary}; }
    strong, b { color: ${style.colors.primary}; }
  `

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><style>${styleCss}</style></head><body>${content || '<p style="text-align:center;color:#999;padding:80px 0;">在左侧编辑器中输入内容<br/>这里会实时预览排版效果</p>'}</body></html>`

  return (
    <div className="flex justify-center">
      {/* 手机外壳 */}
      <div className="relative w-[300px] h-[600px] bg-gray-900 rounded-[2.5rem] p-[10px] shadow-xl">
        {/* 顶部刘海 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-b-2xl z-10" />

        {/* 屏幕区域 */}
        <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden flex flex-col">
          {/* 状态栏 */}
          <div className="flex-shrink-0 flex items-center justify-between px-6 pt-2 pb-1 text-[10px] text-gray-500">
            <span className="font-medium">9:41</span>
            <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
              <svg className="w-3.5 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
            </div>
          </div>

          {/* 文章内容 */}
          <iframe
            srcDoc={html}
            className="flex-1 w-full border-0"
            title="手机预览"
            sandbox="allow-same-origin"
          />
        </div>
      </div>
    </div>
  )
}