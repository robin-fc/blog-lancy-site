'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Heading1, 
  Heading2, 
  Heading3,
  Undo,
  Redo,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react'

export function Toolbar() {
  return (
    <div className="flex items-center gap-1 px-2 py-2 overflow-x-auto">
      {/* 撤销/重做 */}
      <Button variant="ghost" size="sm" title="撤销">
        <Undo className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" title="重做">
        <Redo className="w-4 h-4" />
      </Button>
      
      <div className="w-px h-6 bg-gray-200 mx-1" />
      
      {/* 标题 */}
      <Button variant="ghost" size="sm" title="一级标题">
        <Heading1 className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" title="二级标题">
        <Heading2 className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" title="三级标题">
        <Heading3 className="w-4 h-4" />
      </Button>
      
      <div className="w-px h-6 bg-gray-200 mx-1" />
      
      {/* 格式 */}
      <Button variant="ghost" size="sm" title="粗体">
        <Bold className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" title="斜体">
        <Italic className="w-4 h-4" />
      </Button>
      
      <div className="w-px h-6 bg-gray-200 mx-1" />
      
      {/* 列表 */}
      <Button variant="ghost" size="sm" title="无序列表">
        <List className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" title="有序列表">
        <ListOrdered className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" title="引用">
        <Quote className="w-4 h-4" />
      </Button>
      
      <div className="w-px h-6 bg-gray-200 mx-1" />
      
      {/* 对齐 */}
      <Button variant="ghost" size="sm" title="左对齐">
        <AlignLeft className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" title="居中">
        <AlignCenter className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" title="右对齐">
        <AlignRight className="w-4 h-4" />
      </Button>
      
      <div className="w-px h-6 bg-gray-200 mx-1" />
      
      {/* 插入 */}
      <Button variant="ghost" size="sm" title="插入链接">
        <Link className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" title="插入图片">
        <Image className="w-4 h-4" />
      </Button>
      
      <div className="flex-1" />
      
      {/* 搜索 */}
      <Input 
        placeholder="搜索..." 
        className="w-40 h-8 text-sm"
      />
    </div>
  )
}