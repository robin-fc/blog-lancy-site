import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createServerClient } from '@/lib/supabase'

// GET /api/articles — 列出用户文章
export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: '未登录' }, { status: 401 })

  const client = createServerClient()
  const { data: { user }, error: authErr } = await client.auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: '认证失败' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  let query = client
    .from('articles')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status) query = query.eq('status', status)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ articles: data, total: data?.length ?? 0 })
}

// POST /api/articles — 创建文章
export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: '未登录' }, { status: 401 })

  const client = createServerClient()
  const { data: { user }, error: authErr } = await client.auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: '认证失败' }, { status: 401 })

  const body = await req.json()
  const { title, content, style_pack_id, template_id } = body

  const { data, error } = await client
    .from('articles')
    .insert({
      user_id: user.id,
      title: title || '未命名文章',
      content: content || '',
      style_pack_id: style_pack_id || null,
      template_id: template_id || null,
      word_count: (content || '').replace(/<[^>]+>/g, '').length,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ article: data })
}
