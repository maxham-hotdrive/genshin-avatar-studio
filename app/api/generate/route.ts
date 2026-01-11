import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { generateAllMoods } from '@/lib/replicate/client'
import { validateConfig } from '@/lib/prompts/generator'
import type { AvatarConfig } from '@/types'

/**
 * POST /api/generate
 * 生成头像 + 4个表情
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { config, userId } = body as { config: AvatarConfig; userId?: string }

    // 验证配置
    const validation = validateConfig(config)
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid configuration', details: validation.errors },
        { status: 400 }
      )
    }

    console.log('[API] Starting generation for config:', config)

    // 创建生成记录
    const { data: generation, error: dbError } = await supabaseAdmin
      .from('generations')
      .insert({
        user_id: userId || null,
        style: config.style,
        config: config,
        status: 'processing'
      })
      .select()
      .single()

    if (dbError) {
      console.error('[API] Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to create generation record' },
        { status: 500 }
      )
    }

    console.log('[API] Generation record created:', generation.id)

    // 异步生成图片
    try {
      const images = await generateAllMoods(config, generation.id, {
        width: 512,
        height: 512
      })

      console.log('[API] All images generated successfully')

      // 更新数据库记录
      const { error: updateError } = await supabaseAdmin
        .from('generations')
        .update({
          images: images,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', generation.id)

      if (updateError) {
        console.error('[API] Failed to update generation:', updateError)
      }

      return NextResponse.json({
        success: true,
        generationId: generation.id,
        images: images,
        status: 'completed'
      })
    } catch (genError: any) {
      console.error('[API] Generation failed:', genError)

      // 更新为失败状态
      await supabaseAdmin
        .from('generations')
        .update({
          status: 'failed',
          error_message: genError.message
        })
        .eq('id', generation.id)

      return NextResponse.json(
        {
          error: 'Generation failed',
          message: genError.message,
          generationId: generation.id
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('[API] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

/**
 * GET /api/generate/:id
 * 查询生成状态
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Generation ID is required' },
        { status: 400 }
      )
    }

    const { data: generation, error } = await supabaseAdmin
      .from('generations')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !generation) {
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: generation.id,
      status: generation.status,
      images: generation.images,
      config: generation.config,
      paid: generation.paid,
      createdAt: generation.created_at,
      completedAt: generation.completed_at,
      error: generation.error_message
    })
  } catch (error: any) {
    console.error('[API] Error fetching generation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch generation' },
      { status: 500 }
    )
  }
}
