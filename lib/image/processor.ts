import sharp from 'sharp'

/**
 * 平台头像规格定义
 */
export interface PlatformSpec {
  name: string
  size: number
  shape: 'circle' | 'square'
  category: 'social' | 'gaming' | 'streaming' | 'professional'
  background?: string  // 背景颜色（hex）
}

/**
 * 主流平台头像规格
 */
export const PLATFORM_SPECS: Record<string, PlatformSpec> = {
  // 社交媒体
  discord: { name: 'Discord', size: 128, shape: 'circle', category: 'social' },
  twitter: { name: 'Twitter/X', size: 400, shape: 'circle', category: 'social' },
  instagram: { name: 'Instagram', size: 320, shape: 'circle', category: 'social' },
  facebook: { name: 'Facebook', size: 180, shape: 'circle', category: 'social' },
  linkedin: { name: 'LinkedIn', size: 400, shape: 'square', category: 'social' },
  tiktok: { name: 'TikTok', size: 200, shape: 'circle', category: 'social' },

  // 游戏平台
  steam: { name: 'Steam', size: 184, shape: 'square', category: 'gaming' },
  xbox: { name: 'Xbox', size: 1080, shape: 'square', category: 'gaming' },
  playstation: { name: 'PlayStation', size: 1000, shape: 'square', category: 'gaming' },
  epicgames: { name: 'Epic Games', size: 512, shape: 'square', category: 'gaming' },
  nintendo: { name: 'Nintendo Switch', size: 256, shape: 'square', category: 'gaming' },

  // 直播平台
  twitch: { name: 'Twitch', size: 256, shape: 'circle', category: 'streaming' },
  youtube: { name: 'YouTube', size: 800, shape: 'circle', category: 'streaming' },
  kick: { name: 'Kick', size: 300, shape: 'circle', category: 'streaming' },

  // 专业/通用
  highres: { name: 'High Resolution', size: 1024, shape: 'square', category: 'professional' },
  transparent: { name: 'Transparent BG', size: 512, shape: 'square', category: 'professional' },
  print: { name: 'Print Quality', size: 2048, shape: 'square', category: 'professional' }
}

/**
 * 壁纸规格
 */
export interface WallpaperSpec {
  name: string
  width: number
  height: number
  fit: 'cover' | 'contain'
}

export const WALLPAPER_SPECS: Record<string, WallpaperSpec> = {
  mobile: { name: 'Mobile Wallpaper', width: 1080, height: 1920, fit: 'cover' },
  desktop: { name: 'Desktop Wallpaper', width: 1920, height: 1080, fit: 'contain' }
}

/**
 * 创建圆形遮罩
 */
async function createCircleMask(size: number): Promise<Buffer> {
  const svg = `
    <svg width="${size}" height="${size}">
      <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="white"/>
    </svg>
  `
  return Buffer.from(svg)
}

/**
 * 处理单个平台头像
 */
export async function processAvatar(
  inputBuffer: Buffer,
  platform: PlatformSpec,
  options: {
    removeBg?: boolean
    backgroundColor?: string
  } = {}
): Promise<Buffer> {
  let image = sharp(inputBuffer)

  // 1. Resize 到目标尺寸
  image = image.resize(platform.size, platform.size, {
    fit: 'cover',
    position: 'center'
  })

  // 2. 如果需要圆形裁剪
  if (platform.shape === 'circle') {
    const mask = await createCircleMask(platform.size)
    image = image.composite([{
      input: mask,
      blend: 'dest-in'
    }])
  }

  // 3. 处理背景
  if (options.removeBg) {
    // 保持透明背景
    image = image.png({ compressionLevel: 9 })
  } else if (options.backgroundColor) {
    // 添加纯色背景
    image = image.flatten({ background: options.backgroundColor })
  }

  return image.png({ quality: 95 }).toBuffer()
}

/**
 * 批量生成所有平台头像
 */
export async function generateAvatarPack(
  originalImageBuffer: Buffer
): Promise<Record<string, Buffer>> {
  const results: Record<string, Buffer> = {}

  console.log('[ImageProcessor] Generating avatar pack for all platforms...')

  // 生成所有平台尺寸
  for (const [key, spec] of Object.entries(PLATFORM_SPECS)) {
    try {
      const buffer = await processAvatar(originalImageBuffer, spec, {
        removeBg: key === 'transparent',
        backgroundColor: spec.background
      })
      results[key] = buffer
      console.log(`[ImageProcessor] ✓ Generated ${spec.name} (${spec.size}x${spec.size})`)
    } catch (error) {
      console.error(`[ImageProcessor] ✗ Failed to generate ${spec.name}:`, error)
    }
  }

  return results
}

/**
 * 生成壁纸
 */
export async function generateWallpaper(
  originalImageBuffer: Buffer,
  spec: WallpaperSpec,
  backgroundColor: string = '#1a1a2e'
): Promise<Buffer> {
  return sharp(originalImageBuffer)
    .resize(spec.width, spec.height, {
      fit: spec.fit,
      position: 'center',
      background: backgroundColor
    })
    .png({ quality: 95 })
    .toBuffer()
}

/**
 * 批量生成壁纸
 */
export async function generateWallpapers(
  originalImageBuffer: Buffer
): Promise<Record<string, Buffer>> {
  const results: Record<string, Buffer> = {}

  console.log('[ImageProcessor] Generating wallpapers...')

  for (const [key, spec] of Object.entries(WALLPAPER_SPECS)) {
    try {
      const buffer = await generateWallpaper(originalImageBuffer, spec)
      results[key] = buffer
      console.log(`[ImageProcessor] ✓ Generated ${spec.name} (${spec.width}x${spec.height})`)
    } catch (error) {
      console.error(`[ImageProcessor] ✗ Failed to generate ${spec.name}:`, error)
    }
  }

  return results
}

/**
 * 获取图片元数据
 */
export async function getImageMetadata(buffer: Buffer) {
  return sharp(buffer).metadata()
}
