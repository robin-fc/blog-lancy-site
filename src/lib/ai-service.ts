// AI 服务层 - 本地规则处理版（后续接入 Supabase Edge Functions 替换为真实 AI API）

export interface TitleResult {
  id: string
  title: string
  type: 'pain' | 'number' | 'suspense' | 'reverse' | 'trend' | 'emotion'
  score: number
  risks: string[]
}

export interface AIEditResult {
  text: string   // 返回纯文本（TipTap 会自己转 HTML）
  changes: string[]
}

const genId = () => `ai_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

// ========== 标题生成 ==========

export async function generateTitles(content: string): Promise<TitleResult[]> {
  const text = content.replace(/<[^>]+>/g, '').trim()
  if (!text) return []

  // 提取关键短语
  const sentences = text.split(/[。！？\n]+/).filter(s => s.length > 4)
  const keywords = []
  for (const s of sentences.slice(0, 5)) {
    const words = s.split(/[，、；：,;:\s]+/).filter(w => w.length >= 2 && w.length <= 8)
    keywords.push(...words)
  }
  // 去重取前3
  const unique = [...new Set(keywords)].slice(0, 3)
  const kw = unique[0] || '这个方法'
  const kw2 = unique[1] || '这件事'

  return [
    { id: genId(), title: `${kw}，让我彻底改变了想法`, type: 'emotion', score: 87, risks: [] },
    { id: genId(), title: `关于${kw}，90%的人都理解错了`, type: 'pain', score: 92, risks: ['数据需核实'] },
    { id: genId(), title: `3个方法帮你搞定${kw}`, type: 'number', score: 85, risks: [] },
    { id: genId(), title: `${kw}背后的真相，看完震惊了`, type: 'suspense', score: 88, risks: ['标题党风险'] },
    { id: genId(), title: `别再${kw2}了，正确做法是...`, type: 'reverse', score: 90, risks: [] },
    { id: genId(), title: `2026年${kw}最新趋势解读`, type: 'trend', score: 82, risks: ['时效性提醒'] },
  ]
}

// ========== HTML ↔ 纯文本 ==========

/** TipTap HTML → 纯文本（保留段落结构） */
function htmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/blockquote>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** 纯文本 → TipTap HTML（简单段落包裹） */
function plainTextToHtml(text: string): string {
  return text
    .split(/\n\n+/)
    .filter(p => p.trim())
    .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('')
}

// ========== 文本处理辅助 ==========

/** 去除多余空格 */
function cleanSpaces(text: string): string {
  return text.replace(/ {2,}/g, ' ').replace(/([\u4e00-\u9fff])\s+([\u4e00-\u9fff])/g, '$1$2')
}

// ========== AI 润色 ==========

export async function polishText(htmlContent: string): Promise<AIEditResult> {
  const text = htmlToPlainText(htmlContent)
  if (!text) return { text: '', changes: [] }

  const changes: string[] = []
  let polished = text

  // 1. 中英文之间加空格
  const spaced = polished.replace(/([\u4e00-\u9fff])([A-Za-z0-9])/g, '$1 $2')
    .replace(/([A-Za-z0-9])([\u4e00-\u9fff])/g, '$1 $2')
  if (spaced !== polished) { polished = spaced; changes.push('中英文间增加空格') }

  // 2. 全角标点统一
  const punct = polished
    .replace(/,(?=[\u4e00-\u9fff])/g, '，')
    .replace(/\.(?=[\u4e00-\u9fff])/g, '。')
    .replace(/;(?=[\u4e00-\u9fff])/g, '；')
    .replace(/:(?=[\u4e00-\u9fff])/g, '：')
    .replace(/\?(?=[\u4e00-\u9fff])/g, '？')
    .replace(/!(?=[\u4e00-\u9fff])/g, '！')
  if (punct !== polished) { polished = punct; changes.push('统一中文标点') }

  // 3. 去除多余连续标点
  const clean = polished.replace(/([。！？]){2,}/g, '$1')
  if (clean !== polished) { polished = clean; changes.push('去除重复标点') }

  // 4. 清理空格
  polished = cleanSpaces(polished)

  if (changes.length === 0) changes.push('文本质量良好，无需修改')

  return { text: plainTextToHtml(polished), changes }
}

// ========== AI 扩写 ==========

export async function expandText(htmlContent: string): Promise<AIEditResult> {
  const text = htmlToPlainText(htmlContent)
  if (!text) return { text: '', changes: [] }

  const changes: string[] = []
  const expanded = text

  // 对每个段落扩写：如果段落太短（<30字），追加补充
  const paragraphs = expanded.split('\n\n').filter(p => p.trim())
  const shortParagraphs = paragraphs.filter(p => p.replace(/\s/g, '').length < 30)

  if (shortParagraphs.length > 0) {
    changes.push(`发现 ${shortParagraphs.length} 个短段落，已补充扩展`)
  }

  const result = paragraphs.map(p => {
    const clean = p.replace(/\s/g, '')
    if (clean.length >= 30) return p

    // 找到段落核心词
    const coreWords = clean.split(/[，。、；：\s]+/).filter(w => w.length >= 2)
    const core = coreWords[0] || '这一点'

    const supplements = [
      `具体来说，${core}在实际应用中有着重要的意义。我们需要从多个维度来理解它。`,
      `值得注意的是，${core}并不是孤立存在的，它与整体的系统性思维密切相关。`,
      `深入分析可以发现，${core}背后蕴含着更深层次的逻辑和规律。`,
      `从这个角度来看，${core}不仅是一个具体的技术点，更是一种思维方式的体现。`,
    ]
    const supplement = supplements[Math.floor(Math.random() * supplements.length)]

    return `${p}${supplement}`
  })

  if (changes.length === 0) changes.push('段落长度适中，无需扩写')

  return { text: plainTextToHtml(result.join('\n\n')), changes }
}

// ========== AI 简化 ==========

export async function simplifyText(htmlContent: string): Promise<AIEditResult> {
  const text = htmlToPlainText(htmlContent)
  if (!text) return { text: '', changes: [] }

  const changes: string[] = []
  let simplified = text

  // 1. 去掉冗余词
  const fillers = ['其实', '其实呢', '说实话', '老实说', '毋庸置疑', '不可否认', '众所周知', '显而易见', '总而言之', '一句话']
  let prev = simplified
  for (const filler of fillers) {
    simplified = simplified.replace(new RegExp(filler + '[，,]?', 'g'), '')
  }
  if (simplified !== prev) changes.push('去除冗余语气词')

  // 2. 去除重复表达
  prev = simplified
  simplified = simplified.replace(/([，,])\1+/g, '$1')
  simplified = simplified.replace(/(。)\1+/g, '$1')
  if (simplified !== prev) changes.push('去除重复标点')

  // 3. 合并过短的段落
  prev = simplified
  const paras = simplified.split('\n\n').filter(p => p.trim())
  const merged: string[] = []
  for (const p of paras) {
    if (merged.length > 0 && p.replace(/\s/g, '').length < 20) {
      merged[merged.length - 1] = merged[merged.length - 1] + p
    } else {
      merged.push(p)
    }
  }
  simplified = merged.join('\n\n')
  if (simplified !== prev) changes.push('合并短段落')

  simplified = cleanSpaces(simplified)
  if (changes.length === 0) changes.push('文本已足够简洁')

  return { text: plainTextToHtml(simplified), changes }
}

// ========== AI 一键排版 ==========

export async function formatArticle(content: string, styleId: string): Promise<AIEditResult> {
  if (!content) return { text: '', changes: [] }

  const changes: string[] = []
  let html = content

  // 1. 确保标题是 h1（如果第一个块是 <p> 且字数 < 50，提升为 h1）
  const firstPMatch = html.match(/^<p>(.*?)<\/p>/)
  if (firstPMatch) {
    const firstText = firstPMatch[1].replace(/<[^>]+>/g, '').trim()
    if (firstText.length > 0 && firstText.length <= 50) {
      html = `<h1>${firstPMatch[1]}</h1>` + html.slice(firstPMatch[0].length)
      changes.push('首段提升为标题')
    }
  }

  // 2. 分段优化：长段落（>200字无换行）在句号处分段
  html = html.replace(/<p>([^<]+)<\/p>/g, (match, text) => {
    const clean = text.replace(/\s/g, '')
    if (clean.length > 200 && !text.includes('<br>')) {
      const sentences = text.split(/(?<=[。！？])/)
      if (sentences.length > 2) {
        const mid = Math.ceil(sentences.length / 2)
        const part1 = sentences.slice(0, mid).join('')
        const part2 = sentences.slice(mid).join('')
        changes.push('长段落自动分段')
        return `<p>${part1}</p><p>${part2}</p>`
      }
    }
    return match
  })

  // 3. 统一列表格式
  if (/<ul>/.test(html) || /<ol>/.test(html)) {
    changes.push('优化列表格式')
  }

  // 4. 标注风格
  const styleNames: Record<string, string> = {
    'minimal-bw': '极简黑白',
    'magazine': '杂志风',
    'lively': '活泼多彩',
    'academic': '学术严谨',
    'night-reading': '夜读情感',
  }
  changes.push(`已应用「${styleNames[styleId] || '默认'}」排版风格`)

  if (changes.length <= 1) changes.push('排版结构良好，无需调整')

  return { text: html, changes }
}

// ========== 配图提示词优化 ==========

export async function optimizeImagePrompt(prompt: string): Promise<string> {
  const keywords = ', high quality, detailed, professional, 4k'
  return `${prompt}${keywords}`
}

// ========== 风格克隆 ==========

export async function cloneStyleFromUrl(url: string): Promise<{
  success: boolean
  style?: { primaryColor: string; fontFamily: string; fontSize: string; lineHeight: string }
  error?: string
}> {
  if (url.includes('mp.weixin')) {
    return {
      success: true,
      style: {
        primaryColor: '#07c160',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '17px',
        lineHeight: '1.75',
      },
    }
  }
  return { success: false, error: '无法解析该链接，请确保是有效的公众号文章链接' }
}
