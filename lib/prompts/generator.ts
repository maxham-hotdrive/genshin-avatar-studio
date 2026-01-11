import type { Style, Gender, HairStyle, HairColor, EyeColor, Trait, Mood, AvatarConfig } from '@/types'

/**
 * Prompt 模板生成器
 * 根据用户配置生成适合 FLUX.1-schnell 的 prompt
 */

// 风格描述映射
const STYLE_PROMPTS: Record<Style, string> = {
  genshin: 'Genshin Impact official art style, miHoYo character design, anime cel-shaded illustration, vibrant saturated colors, clean line art, soft gradient shading, gacha game character portrait, detailed costume design, fantasy RPG aesthetic, Teyvat character style, professional game illustration quality, smooth anime rendering',
  honkai: 'Honkai Star Rail style, sci-fi anime aesthetic, Hoyoverse art style, detailed character portrait, premium game artwork',
  retro90s: '1990s retro anime style, vintage cel animation, classic shoujo/shounen aesthetic, nostalgic 90s color palette',
  pixel: '32-bit pixel art style, detailed pixel character sprite, retro game aesthetic, clean pixel art, vibrant pixel colors',
  jjk: 'Jujutsu Kaisen anime style, MAPPA studio quality, modern shounen aesthetic, detailed linework, dynamic character design',
  ghibli: 'Studio Ghibli style, Hayao Miyazaki aesthetic, hand-drawn animation quality, soft watercolor tones, whimsical character design',
  shinkai: 'Makoto Shinkai style, detailed digital painting, cinematic lighting, photorealistic anime aesthetic, Your Name quality',
  persona5: 'Persona 5 style, stylized character portrait, bold red and black color scheme, Shigenori Soejima art style, high contrast'
}

// 性别描述
const GENDER_PROMPTS: Record<Gender, string> = {
  male: 'male character, masculine features',
  female: 'female character, feminine features'
}

// 发型描述
const HAIRSTYLE_PROMPTS: Record<HairStyle, string> = {
  long: 'long flowing hair',
  short: 'short hair',
  ponytail: 'hair in ponytail',
  twintails: 'twin tails hairstyle',
  braid: 'braided hair'
}

// 发色描述
const HAIRCOLOR_PROMPTS: Record<HairColor, string> = {
  black: 'black hair',
  brown: 'brown hair',
  blonde: 'blonde hair',
  silver: 'silver hair',
  white: 'white hair',
  red: 'red hair',
  pink: 'pink hair',
  blue: 'blue hair',
  purple: 'purple hair',
  green: 'green hair'
}

// 眼睛颜色描述
const EYECOLOR_PROMPTS: Record<EyeColor, string> = {
  blue: 'blue eyes',
  green: 'green eyes',
  brown: 'brown eyes',
  red: 'red eyes',
  purple: 'purple eyes',
  gold: 'golden eyes',
  pink: 'pink eyes'
}

// 特征描述
const TRAIT_PROMPTS: Record<Trait, string> = {
  glasses: 'wearing glasses',
  eyepatch: 'wearing eyepatch',
  'elf-ears': 'elf ears, pointed ears',
  horns: 'demon horns, fantasy horns',
  wings: 'angel wings, feathered wings',
  'cat-ears': 'cat ears, neko features'
}

// 表情描述
const MOOD_PROMPTS: Record<Mood, string> = {
  avatar: 'neutral expression, confident pose, character portrait',
  happy: 'happy expression, cheerful smile, joyful mood',
  angry: 'angry expression, fierce look, determined eyes',
  sad: 'sad expression, melancholic mood, gentle tears',
  smug: 'smug expression, confident smirk, playful attitude'
}

/**
 * 生成完整的 Prompt（增强一致性）
 */
export function generatePrompt(config: AvatarConfig, mood: Mood = 'avatar'): string {
  const parts: string[] = []

  // 1. 风格（最重要，放在最前面）
  parts.push(STYLE_PROMPTS[config.style])

  // 2. 一致性标签（关键！确保角色一致性）
  parts.push('same character, consistent character design, character reference sheet style, single character focus')

  // 对于 Genshin 风格，添加特定的一致性增强
  if (config.style === 'genshin') {
    parts.push('official character splash art, character profile illustration')
  }

  // 3. 表情/情绪（但保持其他特征一致）
  if (mood === 'avatar') {
    parts.push('neutral expression, calm and confident, front-facing portrait, direct eye contact with viewer')
  } else {
    parts.push(`${MOOD_PROMPTS[mood]}, same face and features, consistent facial structure`)
  }

  // 4. 性别
  parts.push(GENDER_PROMPTS[config.gender])

  // 5. 详细的发型描述（增强一致性）
  const hairDesc = `${HAIRCOLOR_PROMPTS[config.hairColor]} ${HAIRSTYLE_PROMPTS[config.hairStyle]}`
  parts.push(hairDesc)

  // 重复关键特征以增强权重
  if (config.hairStyle === 'twintails' || config.hairStyle === 'ponytail') {
    parts.push(`distinctive ${config.hairStyle}`)
  }

  // 6. 眼睛颜色（强调）
  parts.push(`${EYECOLOR_PROMPTS[config.eyeColor]}, expressive eyes`)

  // 7. 特殊特征（这些特征每张图必须一致！）
  if (config.traits.length > 0) {
    const traitDescriptions = config.traits.map(trait => TRAIT_PROMPTS[trait])
    parts.push(traitDescriptions.join(', '))
    // 再次强调特征
    parts.push(`always with ${config.traits.map(t => t.replace('-', ' ')).join(' and ')}`)
  }

  // 8. 构图和视角（保持一致）
  parts.push('bust shot, from chest up, centered composition, simple background')
  parts.push('front view, looking at viewer, clear facial features, symmetrical face')

  // 9. 质量提示词
  parts.push('masterpiece, best quality, highly detailed, sharp focus, 4k quality')
  parts.push('consistent lighting, professional character design, clean rendering')

  // Genshin 特定质量标签
  if (config.style === 'genshin') {
    parts.push('official art quality, HoYoverse standard, premium game character illustration')
  }

  return parts.join(', ')
}

/**
 * 生成负面提示词（用于某些模型）
 */
export function generateNegativePrompt(): string {
  return 'low quality, blurry, distorted, deformed, watermark, text, signature, username, multiple characters, nsfw, nude, full body, multiple heads, extra limbs, bad anatomy, disfigured, mutation, mutated, extra fingers, poorly drawn hands, poorly drawn face, bad proportions, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, cropped, worst quality, low resolution, jpeg artifacts, duplicate, morbid, mutilated, out of frame, bad art, bad colors, unnatural colors, oversaturated, undersaturated'
}

/**
 * 为所有表情生成 Prompts
 */
export function generateAllMoodPrompts(config: AvatarConfig): Record<Mood, string> {
  const moods: Mood[] = ['avatar', 'happy', 'angry', 'sad', 'smug']
  const prompts: Record<string, string> = {}

  for (const mood of moods) {
    prompts[mood] = generatePrompt(config, mood)
  }

  return prompts as Record<Mood, string>
}

/**
 * 验证配置是否有效
 */
export function validateConfig(config: AvatarConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!config.style) errors.push('Style is required')
  if (!config.gender) errors.push('Gender is required')
  if (!config.hairStyle) errors.push('Hair style is required')
  if (!config.hairColor) errors.push('Hair color is required')
  if (!config.eyeColor) errors.push('Eye color is required')
  if (!Array.isArray(config.traits)) errors.push('Traits must be an array')
  if (!Array.isArray(config.moods)) errors.push('Moods must be an array')

  return {
    valid: errors.length === 0,
    errors
  }
}
