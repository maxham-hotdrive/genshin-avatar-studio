import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { generateImage } from '@/lib/replicate/client'
import { validateConfig } from '@/lib/prompts/generator'
import { generateAvatarPack, generateWallpapers } from '@/lib/image/processor'
import { createAvatarZip, uploadZipToSupabase } from '@/lib/image/packager'
import type { AvatarConfig } from '@/types'

/**
 * POST /api/generate-avatar-pack
 * 生成完整的头像资产包（头像 + 多平台尺寸 + 壁纸 + ZIP）
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

    console.log('[API] Starting avatar pack generation for config:', config)

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

    try {
      // Step 1: 生成原始头像图片（512x512 高质量）
      console.log('[API] Step 1: Generating original avatar...')
      const originalImageUrl = await generateImage(config, 'avatar', generation.id, {
        width: 1024,
        height: 1024
      })

      console.log('[API] ✓ Original avatar generated:', originalImageUrl)

      // Step 2: 下载原图到 Buffer
      console.log('[API] Step 2: Downloading original image...')
      const imageResponse = await fetch(originalImageUrl)
      if (!imageResponse.ok) {
        throw new Error(`Failed to download image: ${imageResponse.statusText}`)
      }
      const originalImageBuffer = Buffer.from(await imageResponse.arrayBuffer())
      console.log('[API] ✓ Image downloaded, size:', originalImageBuffer.length, 'bytes')

      // Step 3: 生成所有平台尺寸的头像
      console.log('[API] Step 3: Generating multi-platform avatars...')
      const avatarBuffers = await generateAvatarPack(originalImageBuffer)
      console.log('[API] ✓ Generated', Object.keys(avatarBuffers).length, 'platform avatars')

      // Step 4: 生成壁纸（可选）
      console.log('[API] Step 4: Generating wallpapers...')
      const wallpaperBuffers = await generateWallpapers(originalImageBuffer)
      console.log('[API] ✓ Generated', Object.keys(wallpaperBuffers).length, 'wallpapers')

      // Step 5: 打包成 ZIP
      console.log('[API] Step 5: Creating ZIP package...')
      const zipBuffer = await createAvatarZip(avatarBuffers, wallpaperBuffers, {
        generationId: generation.id,
        style: config.style
      })
      console.log('[API] ✓ ZIP created, size:', zipBuffer.length, 'bytes')

      // Step 6: 上传 ZIP 到 Supabase
      console.log('[API] Step 6: Uploading ZIP to Supabase...')
      const zipUrl = await uploadZipToSupabase(zipBuffer, generation.id, supabaseAdmin)
      console.log('[API] ✓ ZIP uploaded:', zipUrl)

      // Step 7: 更新数据库记录
      const { error: updateError } = await supabaseAdmin
        .from('generations')
        .update({
          images: {
            original: originalImageUrl,
            zip: zipUrl
          },
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', generation.id)

      if (updateError) {
        console.error('[API] Failed to update generation:', updateError)
      }

      console.log('[API] ✅ Avatar pack generation completed')

      return NextResponse.json({
        success: true,
        generationId: generation.id,
        images: {
          original: originalImageUrl,
          zip: zipUrl
        },
        status: 'completed',
        assets: {
          avatars: Object.keys(avatarBuffers).length,
          wallpapers: Object.keys(wallpaperBuffers).length,
          zipSize: zipBuffer.length
        }
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
