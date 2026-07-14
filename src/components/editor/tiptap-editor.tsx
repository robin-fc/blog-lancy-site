'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import LinkExtension from '@tiptap/extension-link'
import ImageExtension from '@tiptap/extension-image'
import { useRef, useEffect, useCallback } from 'react'
import type { Editor } from '@tiptap/react'

interface TiptapEditorProps {
  content: string
  onChange: (html: string) => void
  onEditorReady?: (editor: Editor) => void
}

export function TiptapEditor({ content, onChange, onEditorReady }: TiptapEditorProps) {
  const isExternalUpdate = useRef(false)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: '把文章粘贴到这里，或从这一行开始写...',
      }),
      Typography,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#b23c22] underline cursor-pointer',
        },
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded',
        },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'tiptap',
      },
    },
    onUpdate: ({ editor }) => {
      if (!isExternalUpdate.current) {
        onChange(editor.getHTML())
      }
    },
    onCreate: ({ editor }) => {
      onEditorReady?.(editor)
    },
  })

  // 监听外部内容变化
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      isExternalUpdate.current = true
      editor.commands.setContent(content, { emitUpdate: false })
      isExternalUpdate.current = false
    }
  }, [content, editor])

  // 通知父组件 editor 实例
  useEffect(() => {
    if (editor) {
      onEditorReady?.(editor)
    }
  }, [editor, onEditorReady])

  const handleImageUpload = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file || !editor) return

      // 先用本地 URL 预览，后续上传到 Supabase Storage
      const url = URL.createObjectURL(file)
      editor.chain().focus().setImage({ src: url }).run()
    }
    input.click()
  }, [editor])

  const addLink = useCallback(() => {
    if (!editor) return
    const url = window.prompt('输入链接地址：')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }, [editor])

  return (
    <div className="overflow-hidden rounded-md border border-[#d8d1c3] bg-white">
      {/* 工具栏 */}
      <div className="sticky top-0 z-10 flex min-h-11 items-center gap-0.5 overflow-x-auto border-b border-[#ded7ca] bg-[#f4efe5] px-3 py-1.5">
        {/* 撤销/重做 */}
        <ToolBtn title="撤销" shortcut="Ctrl+Z" onClick={() => editor?.chain().focus().undo().run()} disabled={!editor?.can().undo()}>
          ↩
        </ToolBtn>
        <ToolBtn title="重做" shortcut="Ctrl+Y" onClick={() => editor?.chain().focus().redo().run()} disabled={!editor?.can().redo()}>
          ↪
        </ToolBtn>

        <Divider />

        {/* 标题 */}
        <ToolBtn title="一级标题" active={editor?.isActive('heading', { level: 1 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>
          H1
        </ToolBtn>
        <ToolBtn title="二级标题" active={editor?.isActive('heading', { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </ToolBtn>
        <ToolBtn title="三级标题" active={editor?.isActive('heading', { level: 3 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </ToolBtn>

        <Divider />

        {/* 格式 */}
        <ToolBtn title="粗体" shortcut="Ctrl+B" active={editor?.isActive('bold')} onClick={() => editor?.chain().focus().toggleBold().run()}>
          <strong>B</strong>
        </ToolBtn>
        <ToolBtn title="斜体" shortcut="Ctrl+I" active={editor?.isActive('italic')} onClick={() => editor?.chain().focus().toggleItalic().run()}>
          <em>I</em>
        </ToolBtn>
        <ToolBtn title="下划线" shortcut="Ctrl+U" active={editor?.isActive('underline')} onClick={() => editor?.chain().focus().toggleUnderline().run()}>
          <u>U</u>
        </ToolBtn>
        <ToolBtn title="高亮" active={editor?.isActive('highlight')} onClick={() => editor?.chain().focus().toggleHighlight({ color: '#fef08a' }).run()}>
          🖍
        </ToolBtn>

        <Divider />

        {/* 对齐 */}
        <ToolBtn title="左对齐" active={editor?.isActive({ textAlign: 'left' })} onClick={() => editor?.chain().focus().setTextAlign('left').run()}>
          ≡
        </ToolBtn>
        <ToolBtn title="居中" active={editor?.isActive({ textAlign: 'center' })} onClick={() => editor?.chain().focus().setTextAlign('center').run()}>
          ≡
        </ToolBtn>

        <Divider />

        {/* 列表 */}
        <ToolBtn title="无序列表" active={editor?.isActive('bulletList')} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
          •
        </ToolBtn>
        <ToolBtn title="有序列表" active={editor?.isActive('orderedList')} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
          1.
        </ToolBtn>
        <ToolBtn title="引用" active={editor?.isActive('blockquote')} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
          &ldquo;
        </ToolBtn>

        <Divider />

        {/* 插入 */}
        <ToolBtn title="插入链接" onClick={addLink}>
          🔗
        </ToolBtn>
        <ToolBtn title="插入图片" onClick={handleImageUpload}>
          🖼
        </ToolBtn>
        <ToolBtn title="分割线" onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
          ―
        </ToolBtn>
      </div>

      {/* 编辑器内容 */}
      <EditorContent editor={editor} />
    </div>
  )
}

function ToolBtn({
  children,
  title,
  active,
  disabled,
  shortcut,
  onClick,
}: {
  children: React.ReactNode
  title: string
  active?: boolean
  disabled?: boolean
  shortcut?: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={shortcut ? `${title} (${shortcut})` : title}
      className={`px-2 py-1 text-sm rounded transition-colors ${
        active
          ? 'bg-[#d64b2a] text-white'
          : disabled
          ? 'text-gray-300 cursor-not-allowed'
          : 'hover:bg-[#e5ded1] text-[#55584f]'
      }`}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="mx-1 h-5 w-px shrink-0 bg-[#d1c9ba]" />
}
