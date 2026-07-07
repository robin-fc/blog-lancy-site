import type { OutputFormat } from '@/types'
import { getStylePackById } from '@/lib/styles'
import type { Article } from '@/types'

interface ExportOptions {
  format: OutputFormat
  article: Article
}

export async function exportArticle({ format, article }: ExportOptions): Promise<string | Blob> {
  const stylePack = article.stylePackId ? getStylePackById(article.stylePackId) : undefined

  switch (format) {
    case 'wechat':
      return generateWechatHtml(article, stylePack)
    case 'zhihu':
      return generateZhihuMarkdown(article)
    case 'markdown':
      return generateMarkdown(article)
    case 'xiaohongshu':
      return generateXiaohongshuImage(article)
    case 'pdf':
      return generatePdf(article, stylePack)
    case 'clipboard':
      return generateClipboardText(article)
    default:
      throw new Error(`Unsupported format: ${format}`)
  }
}

function generateWechatHtml(article: Article, stylePack: ReturnType<typeof getStylePackById>): string {
  const colors = stylePack?.colors || { primary: '#000000', text: '#333333' }
  const spacing = stylePack?.spacing || { paragraphGap: '1.5em', sectionGap: '2em' }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${article.title}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          font-size: 16px;
          line-height: 1.75;
          color: ${colors.text};
          padding: 20px;
          max-width: 100%;
        }
        h1 {
          font-size: 24px;
          font-weight: 600;
          color: ${colors.primary};
          margin-bottom: 1.5em;
          text-align: center;
        }
        h2 {
          font-size: 20px;
          font-weight: 600;
          color: ${colors.primary};
          margin: ${spacing.sectionGap} 0 1em;
        }
        h3 {
          font-size: 18px;
          font-weight: 600;
          color: ${colors.primary};
          margin: ${spacing.sectionGap} 0 1em;
        }
        p {
          margin-bottom: ${spacing.paragraphGap};
          text-align: justify;
        }
        img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 1.5em auto;
        }
        blockquote {
          border-left: 4px solid ${colors.primary};
          padding-left: 16px;
          margin: 1.5em 0;
          color: #666;
          background: #f9fafb;
          padding: 12px 16px;
          border-radius: 4px;
        }
        strong { color: ${colors.primary}; }
        section { margin-bottom: ${spacing.sectionGap}; }
      </style>
    </head>
    <body>
      <h1>${article.title}</h1>
      ${article.content}
    </body>
    </html>
  `.trim()
}

function generateZhihuMarkdown(article: Article): string {
  const content = article.content
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<(?:[^>]+)>/g, '')

  return `# ${article.title}\n\n${content.trim()}`
}

function generateMarkdown(article: Article): string {
  return generateZhihuMarkdown(article)
}

function generateXiaohongshuImage(article: Article): Blob {
  console.log('Xiaohongshu image generation not implemented')
  return new Blob([article.content], { type: 'text/plain' })
}

function generatePdf(article: Article, stylePack: ReturnType<typeof getStylePackById>): Blob {
  console.log('PDF generation not implemented')
  return new Blob([article.content], { type: 'text/html' })
}

function generateClipboardText(article: Article): string {
  const content = article.content
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')

  return `${article.title}\n\n${content.trim()}`
}

export function exportToWechatHTML(content: string, stylePackId: string): string {
  const stylePack = getStylePackById(stylePackId)
  // 简化版本，直接返回带样式的 HTML
  const colors = stylePack?.colors || { primary: '#000000', text: '#333333', secondary: '#666666', accent: '#3b82f6', background: '#ffffff' }
  const spacing = stylePack?.spacing || { paragraphGap: '1.5em', sectionGap: '2em' }
  
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body { font-family: -apple-system, sans-serif; font-size: 16px; line-height: 1.75; color: ${colors.text}; padding: 20px; }
h1 { font-size: 24px; font-weight: 600; color: ${colors.primary}; text-align: center; margin-bottom: 1.5em; }
h2 { font-size: 20px; font-weight: 600; color: ${colors.primary}; border-left: 4px solid ${colors.accent}; padding-left: 12px; margin: 1.5em 0 1em; }
h3 { font-size: 18px; font-weight: 600; color: ${colors.secondary}; margin: 1.5em 0 1em; }
p { margin-bottom: ${spacing.paragraphGap}; text-align: justify; }
blockquote { border-left: 3px solid ${colors.primary}; background: #f9fafb; padding: 12px 16px; margin: 1em 0; color: ${colors.secondary}; }
img { max-width: 100%; }
</style>
</head>
<body>
${content || '<p>暂无内容</p>'}
</body>
</html>`
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  }
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
  return Promise.resolve()
}

export function downloadFile(content: string | Blob, filename: string, mimeType?: string): void {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType || 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}