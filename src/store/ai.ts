import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AIUsage {
  // 文章
  articlesCreated: number
  articlesLimit: number
  
  // AI 功能
  aiLayoutUsed: number
  aiLayoutLimit: number
  
  aiTitleUsed: number
  aiTitleLimit: number
  
  aiImageUsed: number
  aiImageLimit: number
  
  // 重置时间
  resetAt: string
}

export interface FavoriteTitle {
  id: string
  title: string
  type: string
  score: number
  createdAt: string
}

export interface FavoriteImage {
  id: string
  prompt: string
  ratio: string
  url?: string
  createdAt: string
}

export interface AIState {
  usage: AIUsage
  favoriteTitles: FavoriteTitle[]
  favoriteImages: FavoriteImage[]
  
  // Actions
  incrementUsage: (type: 'layout' | 'title' | 'image') => boolean
  canUse: (type: 'layout' | 'title' | 'image') => boolean
  addFavoriteTitle: (title: Omit<FavoriteTitle, 'id' | 'createdAt'>) => void
  removeFavoriteTitle: (id: string) => void
  addFavoriteImage: (image: Omit<FavoriteImage, 'id' | 'createdAt'>) => void
  removeFavoriteImage: (id: string) => void
  resetUsage: () => void
  getUsagePercentage: (type: 'layout' | 'title' | 'image' | 'articles') => number
}

const getPlanLimits = (plan: 'free' | 'pro' | 'team') => {
  switch (plan) {
    case 'pro':
      return {
        articlesLimit: Infinity,
        aiLayoutLimit: 300,
        aiTitleLimit: 200,
        aiImageLimit: 100,
      }
    case 'team':
      return {
        articlesLimit: Infinity,
        aiLayoutLimit: 1000,
        aiTitleLimit: 1000,
        aiImageLimit: 500,
      }
    default:
      return {
        articlesLimit: 5,
        aiLayoutLimit: 10,
        aiTitleLimit: 10,
        aiImageLimit: 3,
      }
  }
}

const getNextResetTime = () => {
  const now = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  return nextMonth.toISOString()
}

const DEFAULT_USAGE: AIUsage = {
  articlesCreated: 0,
  articlesLimit: 5,
  aiLayoutUsed: 0,
  aiLayoutLimit: 10,
  aiTitleUsed: 0,
  aiTitleLimit: 10,
  aiImageUsed: 0,
  aiImageLimit: 3,
  resetAt: getNextResetTime(),
}

export const useAIStore = create<AIState>()(
  persist(
    (set, get) => ({
      usage: DEFAULT_USAGE,
      favoriteTitles: [],
      favoriteImages: [],

      incrementUsage: (type) => {
        const { usage } = get()
        const now = new Date()
        const resetAt = new Date(usage.resetAt)
        
        // 检查是否需要重置
        if (now >= resetAt) {
          get().resetUsage()
        }
        
        const key = type === 'layout' ? 'aiLayoutUsed' 
                  : type === 'title' ? 'aiTitleUsed' 
                  : 'aiImageUsed'
        const limitKey = type === 'layout' ? 'aiLayoutLimit'
                        : type === 'title' ? 'aiTitleLimit'
                        : 'aiImageLimit'
        
        if (usage[key] >= usage[limitKey]) {
          return false
        }
        
        set({
          usage: { ...usage, [key]: usage[key] + 1 }
        })
        
        return true
      },

      canUse: (type) => {
        const { usage } = get()
        const key = type === 'layout' ? 'aiLayoutUsed' 
                  : type === 'title' ? 'aiTitleUsed' 
                  : 'aiImageUsed'
        const limitKey = type === 'layout' ? 'aiLayoutLimit'
                        : type === 'title' ? 'aiTitleLimit'
                        : 'aiImageLimit'
        
        return usage[key] < usage[limitKey]
      },

      addFavoriteTitle: (title) => {
        const newFavorite: FavoriteTitle = {
          ...title,
          id: `fav_title_${Date.now()}`,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          favoriteTitles: [newFavorite, ...state.favoriteTitles],
        }))
      },

      removeFavoriteTitle: (id) => {
        set((state) => ({
          favoriteTitles: state.favoriteTitles.filter((t) => t.id !== id),
        }))
      },

      addFavoriteImage: (image) => {
        const newFavorite: FavoriteImage = {
          ...image,
          id: `fav_img_${Date.now()}`,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          favoriteImages: [newFavorite, ...state.favoriteImages],
        }))
      },

      removeFavoriteImage: (id) => {
        set((state) => ({
          favoriteImages: state.favoriteImages.filter((i) => i.id !== id),
        }))
      },

      resetUsage: () => {
        set({
          usage: {
            ...DEFAULT_USAGE,
            resetAt: getNextResetTime(),
          }
        })
      },

      getUsagePercentage: (type) => {
        const { usage } = get()
        if (type === 'articles') {
          return Math.min(100, (usage.articlesCreated / usage.articlesLimit) * 100)
        }
        const key = type === 'layout' ? 'aiLayoutUsed' 
                  : type === 'title' ? 'aiTitleUsed' 
                  : 'aiImageUsed'
        const limitKey = type === 'layout' ? 'aiLayoutLimit'
                        : type === 'title' ? 'aiTitleLimit'
                        : 'aiImageLimit'
        
        return Math.min(100, (usage[key] / usage[limitKey]) * 100)
      },
    }),
    {
      name: 'blog-ai-storage',
      partialize: (state) => ({ 
        usage: state.usage,
        favoriteTitles: state.favoriteTitles,
        favoriteImages: state.favoriteImages,
      }),
    }
  )
)