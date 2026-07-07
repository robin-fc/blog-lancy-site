import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  plan: 'free' | 'pro' | 'team'
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  checkAuth: () => Promise<void>
}

// 模拟用户数据
const mockUser: User = {
  id: 'user_001',
  name: '测试用户',
  email: 'test@example.com',
  avatar: undefined,
  plan: 'free',
  createdAt: '2026-04-01',
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        
        // 模拟登录延迟
        await new Promise(r => setTimeout(r, 1000))
        
        // 模拟登录验证（实际应调用API）
        if (email && password) {
          set({ 
            user: { ...mockUser, email },
            isAuthenticated: true,
            isLoading: false 
          })
          return true
        }
        
        set({ isLoading: false })
        return false
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        })
        // 清除其他相关状态
        localStorage.removeItem('blog-editor-storage')
        localStorage.removeItem('blog-articles-storage')
      },

      updateUser: (updates) => {
        const { user } = get()
        if (user) {
          set({ user: { ...user, ...updates } })
        }
      },

      checkAuth: async () => {
        const { user } = get()
        if (user) {
          // 验证 token 有效性（实际应调用API）
          set({ isAuthenticated: true })
        }
      },
    }),
    {
      name: 'blog-auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)