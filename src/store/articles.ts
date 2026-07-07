import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

export interface Article {
  id: string
  title: string
  content: string
  stylePackId: string
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
  wordCount: number
  // 统计数据
  views?: number
  likes?: number
  shares?: number
}

export interface ArticlesState {
  articles: Article[]
  currentArticleId: string | null
  
  // Actions
  createArticle: (title?: string) => string
  updateArticle: (id: string, updates: Partial<Article>) => void
  deleteArticle: (id: string) => void
  duplicateArticle: (id: string) => string
  getArticle: (id: string) => Article | undefined
  setCurrentArticle: (id: string | null) => void
  getRecentArticles: (limit?: number) => Article[]
  getArticlesByStatus: (status: Article['status']) => Article[]
}

export const useArticlesStore = create<ArticlesState>()(
  persist(
    (set, get) => ({
      articles: [],
      currentArticleId: null,

      createArticle: (title = '未命名文章') => {
        const now = new Date().toISOString()
        const newArticle: Article = {
          id: uuidv4(),
          title,
          content: '',
          stylePackId: 'minimal',
          status: 'draft',
          createdAt: now,
          updatedAt: now,
          wordCount: 0,
          views: 0,
          likes: 0,
          shares: 0,
        }
        
        set((state) => ({
          articles: [newArticle, ...state.articles],
          currentArticleId: newArticle.id,
        }))
        
        return newArticle.id
      },

      updateArticle: (id, updates) => {
        set((state) => ({
          articles: state.articles.map((article) =>
            article.id === id
              ? { 
                  ...article, 
                  ...updates, 
                  updatedAt: new Date().toISOString(),
                  wordCount: updates.content 
                    ? updates.content.replace(/<[^>]+>/g, '').length 
                    : article.wordCount,
                }
              : article
          ),
        }))
      },

      deleteArticle: (id) => {
        set((state) => ({
          articles: state.articles.filter((article) => article.id !== id),
          currentArticleId: state.currentArticleId === id ? null : state.currentArticleId,
        }))
      },

      duplicateArticle: (id) => {
        const { articles } = get()
        const original = articles.find((a) => a.id === id)
        if (!original) return ''

        const now = new Date().toISOString()
        const newArticle: Article = {
          ...original,
          id: uuidv4(),
          title: `${original.title} (副本)`,
          createdAt: now,
          updatedAt: now,
          status: 'draft',
        }

        set((state) => ({
          articles: [newArticle, ...state.articles],
        }))

        return newArticle.id
      },

      getArticle: (id) => {
        return get().articles.find((a) => a.id === id)
      },

      setCurrentArticle: (id) => {
        set({ currentArticleId: id })
      },

      getRecentArticles: (limit = 10) => {
        return get()
          .articles
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, limit)
      },

      getArticlesByStatus: (status) => {
        return get().articles.filter((a) => a.status === status)
      },
    }),
    {
      name: 'blog-articles-storage',
      partialize: (state) => ({ 
        articles: state.articles,
        currentArticleId: state.currentArticleId,
      }),
    }
  )
)