import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
 return new Intl.DateTimeFormat('zh-CN', {
   year: 'numeric',
   month: 'long',
   day: 'numeric',
 }).format(date)
}

export function generateId(): string {
 return Math.random().toString(36).substring(2, 9)
}

export function wordCount(text: string): number {
  return text.replace(/\s+/g, '').length
}

export function estimateReadTime(text: string): number {
  const count = wordCount(text)
  return Math.max(1, Math.ceil(count / 400))
}
