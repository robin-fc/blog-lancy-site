import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import type { Database } from '@/types/database'

type ArticleUpdate = Database['public']['Tables']['articles']['Update']

// GET /api/articles/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: '未登录' }, { status: 401 })

  const client = createServerClient()
  const { data: { user }, error: authErr } = await client.auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: '认证失败' }, { status: 401 })

  const { id } = await params

  const { data, error } = await client
    .from('articles')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !data) return NextResponse.json({ error: '文章不存在' }, { status: 404 })

  return NextResponse.json({ article: data })
}

// PATCH /api/articles/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: '未登录' }, { status: 401 })

  const client = createServerClient()
  const { data: { user }, error: authErr } = await client.auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: '认证失败' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { title, content, style_pack_id, template_id, status } = body

  const updates: ArticleUpdate = { updated_at: new Date().toISOString() }
  if (title !== undefined) updates.title = title
  if (content !== undefined) {
    updates.content = content
    updates.word_count = content.replace(/<[^>]+>/g, '').length
  }
  if (style_pack_id !== undefined) updates.style_pack_id = style_pack_id
  if (template_id !== undefined) updates.template_id = template_id
  if (status !== undefined) updates.status = status

  const { data, error } = await client
    .from('articles')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: '文章不存在' }, { status: 404 })

  return NextResponse.json({ article: data })
}

// DELETE /api/articles/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: '未登录' }, { status: 401 })

  const client = createServerClient()
  const { data: { user }, error: authErr } = await client.auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: '认证失败' }, { status: 401 })

  const { id } = await params

  const { error } = await client
    .from('articles')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
