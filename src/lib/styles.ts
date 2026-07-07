import type { StylePack } from '@/types'

export const minimalBlackWhite: StylePack = {
  id: 'minimal-bw',
  name: '极简黑白',
  description: '大量留白、黑色正文、仅用灰度。适合科技/商业/个人品牌',
  colors: {
    primary: '#000000',
    secondary: '#4B5563',
    accent: '#9CA3AF',
    background: '#FFFFFF',
    text: '#111827',
  },
  typography: {
    headingFont: 'system-ui',
    bodyFont: 'system-ui',
    headingSizes: ['24px', '20px', '18px'],
    bodySize: '15px',
    lineHeight: 2,
  },
  components: {
    quoteStyle: 'left-border',
    cardStyle: 'flat',
    dividerStyle: 'line',
    buttonStyle: 'rounded',
  },
  spacing: {
    paragraphGap: '1.5em',
    sectionGap: '2.5em',
  },
  imageTreatment: {
    borderRadius: '0px',
    shadow: 'none',
    caption: true,
  },
  isDefault: true,
}

export const magazine: StylePack = {
  id: 'magazine',
  name: '杂志风',
  description: '衬线标题、精致分隔线、引用卡片。适合文化/时尚/深度',
  colors: {
    primary: '#1E293B',
    secondary: '#7C3AED',
    accent: '#C084FC',
    background: '#FAFAFA',
    text: '#1F2937',
  },
  typography: {
    headingFont: 'Georgia, serif',
    bodyFont: 'system-ui',
    headingSizes: ['26px', '22px', '18px'],
    bodySize: '16px',
    lineHeight: 1.85,
  },
  components: {
    quoteStyle: 'block',
    cardStyle: 'rounded-shadow',
    dividerStyle: 'wave',
    buttonStyle: 'pill',
  },
  spacing: {
    paragraphGap: '1.8em',
    sectionGap: '3em',
  },
  imageTreatment: {
    borderRadius: '8px',
    shadow: 'subtle',
    caption: true,
  },
}

export const lively: StylePack = {
  id: 'lively',
  name: '活泼多彩',
  description: '圆角卡片、Emoji 点缀、渐变按钮。适合生活/亲子/美食',
  colors: {
    primary: '#F97316',
    secondary: '#EC4899',
    accent: '#8B5CF6',
    background: '#FFFBEB',
    text: '#374151',
  },
  typography: {
    headingFont: 'system-ui',
    bodyFont: 'system-ui',
    headingSizes: ['24px', '20px', '17px'],
    bodySize: '15px',
    lineHeight: 1.8,
  },
  components: {
    quoteStyle: 'left-border',
    cardStyle: 'rounded-shadow',
    dividerStyle: 'dots',
    buttonStyle: 'pill',
  },
  spacing: {
    paragraphGap: '1.5em',
    sectionGap: '2em',
  },
  imageTreatment: {
    borderRadius: '12px',
    shadow: 'medium',
    caption: true,
  },
}

export const academic: StylePack = {
  id: 'academic',
  name: '学术严谨',
  description: '注释上标、参考文献格式、专业术语高亮。适合教育/科研/医疗',
  colors: {
    primary: '#1E40AF',
    secondary: '#6B7280',
    accent: '#3B82F6',
    background: '#FFFFFF',
    text: '#1F2937',
  },
  typography: {
    headingFont: 'Georgia, serif',
    bodyFont: 'system-ui',
    headingSizes: ['22px', '19px', '16px'],
    bodySize: '15px',
    lineHeight: 1.85,
  },
  components: {
    quoteStyle: 'block',
    cardStyle: 'outlined',
    dividerStyle: 'line',
    buttonStyle: 'rounded',
  },
  spacing: {
    paragraphGap: '1.6em',
    sectionGap: '2.5em',
  },
  imageTreatment: {
    borderRadius: '4px',
    shadow: 'subtle',
    caption: true,
  },
}

export const nightReading: StylePack = {
  id: 'night-reading',
  name: '夜读情感',
  description: '深色背景、暖色文字、短句分行。适合情感/故事/晚安文',
  colors: {
    primary: '#F59E0B',
    secondary: '#D97706',
    accent: '#FBBF24',
    background: '#1A1A2E',
    text: '#E5E7EB',
  },
  typography: {
    headingFont: 'system-ui',
    bodyFont: 'system-ui',
    headingSizes: ['24px', '20px', '17px'],
    bodySize: '16px',
    lineHeight: 2,
  },
  components: {
    quoteStyle: 'minimal',
    cardStyle: 'flat',
    dividerStyle: 'dots',
    buttonStyle: 'pill',
  },
  spacing: {
    paragraphGap: '2em',
    sectionGap: '3em',
  },
  imageTreatment: {
    borderRadius: '8px',
    shadow: 'subtle',
    caption: true,
  },
}

export const builtInStylePacks: StylePack[] = [
  minimalBlackWhite,
  magazine,
  lively,
  academic,
  nightReading,
]

export function getStylePackById(id: string): StylePack | undefined {
  return builtInStylePacks.find((s) => s.id === id)
}
