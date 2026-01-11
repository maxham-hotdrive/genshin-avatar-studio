import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
  try {
    // 测试数据库连接
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1)

    if (error) throw error

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
      env: {
        supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        replicate: !!process.env.REPLICATE_API_TOKEN,
        stripe: !!process.env.STRIPE_SECRET_KEY
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message
    }, { status: 500 })
  }
}
