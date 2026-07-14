import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/templates — 列出模板（内置+用户私有）
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const industry = searchParams.get('industry')
  const scene = searchParams.get('scene')
  const limit = parseInt(searchParams.get('limit') || '20')

  // 公开模板（内置+公开市场）
  let query = supabase
    .from('templates')
    .select('*')
    .order('use_count', { ascending: false })
    .limit(limit)

  if (category) query = query.eq('category', category)
  if (industry) query = query.eq('industry', industry)
  if (scene) query = query.eq('scene', scene)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ templates: data ?? [] })
}
