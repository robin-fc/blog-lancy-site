import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface EditorState {
  // 当前编辑内容
  content: string
  title: string
  stylePackId: string
  
  // Actions
  setContent: (content: string) => void
  setTitle: (title: string) => void
  setStylePack: (styleId: string) => void
  reset: () => void
}

const initialState = {
  content: '',
  title: '',
  stylePackId: 'minimal-bw',
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      ...initialState,

      setContent: (content) => set({ content }),
      setTitle: (title) => set({ title }),
      setStylePack: (stylePackId) => set({ stylePackId }),
      reset: () => set(initialState),
    }),
    {
      name: 'blog-editor-storage',
      partialize: (state) => ({
        content: state.content,
        title: state.title,
        stylePackId: state.stylePackId,
      }),
    }
  )
)
