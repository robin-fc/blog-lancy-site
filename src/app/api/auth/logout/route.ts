import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST /api/auth/logout
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  const { error } = await supabase.auth.admin.signOut(token)

  if (error) {
    // 即使 signOut 失败也返回成功（客户端会清除本地状态）
  }

  return NextResponse.json({ success: true })
}
