import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/styles — 列出风格包（内置+用户私有）
export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')

  // 获取内置风格
  const { data: builtIn, error: builtInErr } = await supabase
    .from('style_packs')
    .select('*')
    .eq('is_default', true)
    .order('name')

  if (builtInErr) return NextResponse.json({ error: builtInErr.message }, { status: 500 })

  // 如果已登录，获取用户私有风格
  let userStyles: unknown[] = []
  if (token) {
    const { createServerClient } = await import('@/lib/supabase')
    const client = createServerClient()
    const { data: { user } } = await client.auth.getUser(token)
    if (user) {
      const { data } = await client
        .from('style_packs')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
      userStyles = data ?? []
    }
  }

  return NextResponse.json({
    styles: [...(builtIn ?? []), ...userStyles],
  })
}

// POST /api/styles — 创建风格包
export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: '未登录' }, { status: 401 })

  const { createServerClient } = await import('@/lib/supabase')
  const client = createServerClient()
  const { data: { user }, error: authErr } = await client.auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: '认证失败' }, { status: 401 })

  const { name, description, config } = await req.json()
  if (!name || !config) return NextResponse.json({ error: '名称和配置不能为空' }, { status: 400 })

  const { data, error } = await client
    .from('style_packs')
    .insert({
      user_id: user.id,
      name,
      description: description || '',
      config,
      is_default: false,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ style: data })
}
