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
      return generatePdf(article)
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

function generatePdf(article: Article): Blob {
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

export function exportToWechatHTMLLegacy(content: string, stylePackId: string): string {
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

export function copyToClipboardLegacy(text: string): Promise<void> {
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

export function exportToWechatHTML(content: string, stylePackId: string): string {
  const stylePack = getStylePackById(stylePackId)
  const colors = stylePack?.colors || {
    primary: '#20221e',
    text: '#33352f',
    secondary: '#666960',
    accent: '#d64b2a',
    background: '#ffffff',
  }
  const spacing = stylePack?.spacing || { paragraphGap: '1.5em', sectionGap: '2em' }

  // 微信会清理 style 标签，因此关键样式直接写入每个元素。
  const documentCopy = new DOMParser().parseFromString(
    '<section id="moko-export">' + (content || '<p>暂无内容</p>') + '</section>',
    'text/html',
  )
  const root = documentCopy.getElementById('moko-export')
  if (!root) return content

  const applyStyles = (selector: string, styles: Partial<CSSStyleDeclaration>) => {
    root.querySelectorAll<HTMLElement>(selector).forEach((element) => {
      Object.assign(element.style, styles)
    })
  }

  Object.assign(root.style, {
    boxSizing: 'border-box',
    maxWidth: '677px',
    margin: '0 auto',
    padding: '20px 12px',
    background: colors.background,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  })
  applyStyles('h1', {
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '1.45',
    color: colors.primary,
    textAlign: 'center',
    margin: '28px 0 24px',
  })
  applyStyles('h2', {
    fontSize: '20px',
    fontWeight: '700',
    lineHeight: '1.5',
    color: colors.primary,
    borderLeft: '4px solid ' + colors.accent,
    paddingLeft: '12px',
    margin: spacing.sectionGap + ' 0 16px',
  })
  applyStyles('h3', {
    fontSize: '18px',
    fontWeight: '700',
    lineHeight: '1.5',
    color: colors.secondary,
    margin: spacing.sectionGap + ' 0 14px',
  })
  applyStyles('p', {
    fontSize: '16px',
    lineHeight: '1.85',
    color: colors.text,
    margin: '0 0 ' + spacing.paragraphGap,
  })
  applyStyles('blockquote', {
    borderLeft: '3px solid ' + colors.primary,
    background: colors.background,
    padding: '12px 16px',
    margin: '20px 0',
    color: colors.secondary,
  })
  applyStyles('img', {
    display: 'block',
    maxWidth: '100%',
    height: 'auto',
    margin: '24px auto',
  })
  applyStyles('strong', { color: colors.primary, fontWeight: '700' })
  applyStyles('ul, ol', {
    paddingLeft: '24px',
    margin: '0 0 20px',
    color: colors.text,
  })
  applyStyles('li', {
    fontSize: '16px',
    lineHeight: '1.8',
    marginBottom: '8px',
  })

  return '<!DOCTYPE html><html><head><meta charset="utf-8"><title>墨刻排版稿</title></head><body>' +
    root.outerHTML +
    '</body></html>'
}

export function copyToClipboard(text: string): Promise<void> {
  const parser = new DOMParser()
  const documentCopy = parser.parseFromString(text, 'text/html')
  const html = documentCopy.body.innerHTML
  const plainText = documentCopy.body.innerText

  if (navigator.clipboard?.write && typeof ClipboardItem !== 'undefined') {
    const item = new ClipboardItem({
      'text/html': new Blob([html], { type: 'text/html' }),
      'text/plain': new Blob([plainText], { type: 'text/plain' }),
    })
    return navigator.clipboard.write([item])
  }

  const container = document.createElement('div')
  container.contentEditable = 'true'
  container.innerHTML = html
  container.style.position = 'fixed'
  container.style.left = '-9999px'
  document.body.appendChild(container)
  const range = document.createRange()
  range.selectNodeContents(container)
  const selection = window.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)
  document.execCommand('copy')
  selection?.removeAllRanges()
  document.body.removeChild(container)
  return Promise.resolve()
}
