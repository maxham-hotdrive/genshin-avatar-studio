import { NextResponse } from 'next/server'
import { generatePrompt, generateAllMoodPrompts, validateConfig } from '@/lib/prompts/generator'
import type { AvatarConfig } from '@/types'

export async function GET() {
  // 测试配置
  const testConfig: AvatarConfig = {
    style: 'genshin',
    gender: 'female',
    hairStyle: 'ponytail',
    hairColor: 'blue',
    eyeColor: 'gold',
    traits: ['cat-ears'],
    moods: ['avatar', 'happy', 'angry', 'sad', 'smug']
  }

  // 验证配置
  const validation = validateConfig(testConfig)
  if (!validation.valid) {
    return NextResponse.json({
      error: 'Invalid config',
      details: validation.errors
    }, { status: 400 })
  }

  // 生成所有 Prompts
  const prompts = generateAllMoodPrompts(testConfig)

  return NextResponse.json({
    success: true,
    config: testConfig,
    validation,
    prompts,
    example: {
      avatar: generatePrompt(testConfig, 'avatar')
    }
  })
}
