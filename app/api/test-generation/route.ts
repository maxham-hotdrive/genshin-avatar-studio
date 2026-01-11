import { NextResponse } from 'next/server'
import { generatePrompt } from '@/lib/prompts/generator'
import type { AvatarConfig, Mood } from '@/types'

/**
 * GET /api/test-generation
 * 测试 prompt 生成，不调用实际的 AI API
 */
export async function GET() {
  try {
    const testConfig: AvatarConfig = {
      style: 'genshin',
      gender: 'female',
      hairStyle: 'long',
      hairColor: 'silver',
      eyeColor: 'blue',
      traits: ['cat-ears']
    }

    const moods: Mood[] = ['avatar', 'happy', 'angry', 'sad', 'smug']
    const prompts: Record<string, string> = {}

    for (const mood of moods) {
      prompts[mood] = generatePrompt(testConfig, mood)
    }

    return NextResponse.json({
      success: true,
      config: testConfig,
      prompts,
      message: 'Prompt generation test successful'
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
