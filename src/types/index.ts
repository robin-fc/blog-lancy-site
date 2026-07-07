import type { Editor } from '@tiptap/react'

export interface Article {
  id: string
  title: string
  content: string
  stylePackId: string | null
  templateId: string | null
  createdAt: Date
  updatedAt: Date
  wordCount: number
  readTime: number
}

export interface StylePack {
  id: string
  name: string
  description: string
  colors: StyleColors
  typography: StyleTypography
  components: StyleComponents
  spacing: StyleSpacing
  imageTreatment: StyleImageTreatment
  isDefault?: boolean
}

export interface StyleColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
}

export interface StyleTypography {
  headingFont: string
  bodyFont: string
  headingSizes: [string, string, string]
  bodySize: string
  lineHeight: number
}

export interface StyleComponents {
  quoteStyle: 'left-border' | 'block' | 'minimal'
  cardStyle: 'rounded-shadow' | 'flat' | 'outlined'
  dividerStyle: 'line' | 'wave' | 'dots'
  buttonStyle: 'pill' | 'rounded' | 'square'
}

export interface StyleSpacing {
  paragraphGap: string
  sectionGap: string
}

export interface StyleImageTreatment {
  borderRadius: string
  shadow: 'none' | 'subtle' | 'medium' | 'strong'
  caption: boolean
}

export interface Template {
  id: string
  name: string
  description: string
  category: TemplateCategory
  industry: string
  scene: string
  structure: string
  thumbnail: string
  useCount: number
  avgReadIncrease: number | null
  stylePackId: string
  isPro: boolean
  isDefault?: boolean
}

export type TemplateCategory = 'industry' | 'scene' | 'structure' | 'hot'

export interface TitleCandidate {
  id: string
  title: string
  type: TitleType
  clickRateScore: number
  riskLevel: 'low' | 'medium' | 'high'
  emotionTag: EmotionTag
  isSelected?: boolean
}

export type TitleType = 'pain-point' | 'number' | 'suspense' | 'counter-intuitive' | 'trending' | 'emotional'

export type EmotionTag = 'positive' | 'negative' | 'neutral'

export interface EditorState {
  article: Article | null
  editor: Editor | null
  isDirty: boolean
  activePanel: 'tools' | 'styles' | 'assets' | null
  previewMode: 'phone' | 'desktop'
  showPreview: boolean
}

export type OutputFormat = 'wechat' | 'zhihu' | 'xiaohongshu' | 'toutiao' | 'pdf' | 'markdown' | 'clipboard'
