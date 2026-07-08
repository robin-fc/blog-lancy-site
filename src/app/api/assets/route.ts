import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createServerClient } from '@/lib/supabase'

const assetTypes = ['image', 'video', 'audio', 'document'] as const
type AssetType = (typeof assetTypes)[number]

function isAssetType(type: string): type is AssetType {
  return assetTypes.includes(type as AssetType)
}

// GET /api/assets — 列出用户素材
export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: '未登录' }, { status: 401 })

  const client = createServerClient()
  const { data: { user }, error: authErr } = await client.auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: '认证失败' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') // image | video | audio | document

  let query = client.from('assets').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
  if (type && isAssetType(type)) query = query.eq('type', type)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ assets: data })
}

// POST /api/assets — 上传素材
export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: '未登录' }, { status: 401 })

  const client = createServerClient()
  const { data: { user }, error: authErr } = await client.auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: '认证失败' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const name = (formData.get('name') as string) || file?.name || '未命名'
  const type = (formData.get('type') as string) || 'document'

  if (!file) return NextResponse.json({ error: '未上传文件' }, { status: 400 })

  // 上传到 Supabase Storage
  const ext = file.name.split('.').pop() || ''
  const path = `${user.id}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { error: uploadErr } = await client.storage
    .from('assets')
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadErr) return NextResponse.json({ error: '上传失败：' + uploadErr.message }, { status: 500 })

  const { data: urlData } = client.storage.from('assets').getPublicUrl(path)

  // 写入数据库
  const { data, error: dbErr } = await client
    .from('assets')
    .insert({
      user_id: user.id,
      name,
      type: type as 'image' | 'video' | 'audio' | 'document',
      url: urlData.publicUrl,
      size_bytes: file.size,
      mime_type: file.type,
    })
    .select()
    .single()

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })

  return NextResponse.json({ asset: data })
}
