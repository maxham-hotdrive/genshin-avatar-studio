import Replicate from 'replicate'
import type { AvatarConfig, Mood } from '@/types'
import { generatePrompt } from '@/lib/prompts/generator'
import { supabaseAdmin } from '@/lib/supabase/admin'

// 初始化 Replicate 客户端
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!
})

// FLUX.1-schnell 模型配置
const FLUX_MODEL = 'black-forest-labs/flux-schnell'
const GENERATION_TIMEOUT = parseInt(process.env.GENERATION_TIMEOUT || '60000')

export interface GenerationOptions {
  width?: number
  height?: number
  num_outputs?: number
  guidance_scale?: number
  num_inference_steps?: number
}

/**
 * 上传图片数据到 Supabase Storage
 */
async function uploadImageToSupabase(
  imageData: Buffer,
  generationId: string,
  mood: Mood
): Promise<string> {
  const fileName = `${generationId}/${mood}.png`

  console.log(`[Supabase] Uploading ${fileName}...`)

  const { data, error } = await supabaseAdmin.storage
    .from('generated-images')
    .upload(fileName, imageData, {
      contentType: 'image/png',
      upsert: true
    })

  if (error) {
    console.error('[Supabase] Upload error:', error)
    throw new Error(`Failed to upload image: ${error.message}`)
  }

  // 获取公开 URL
  const { data: publicData } = supabaseAdmin.storage
    .from('generated-images')
    .getPublicUrl(fileName)

  console.log(`[Supabase] ✓ Uploaded: ${publicData.publicUrl}`)

  return publicData.publicUrl
}

/**
 * 延迟函数
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 生成单张图片（带自动重试）
 */
export async function generateImage(
  config: AvatarConfig,
  mood: Mood = 'avatar',
  generationId: string,
  options: GenerationOptions = {}
): Promise<string> {
  const prompt = generatePrompt(config, mood)
  const maxRetries = 3
  let lastError: any

  console.log('[Replicate] Generating image with prompt:', prompt)

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // 使用 run() 方法获取流式输出
      const output = await replicate.run(
        FLUX_MODEL,
        {
          input: {
            prompt,
            width: options.width || 512,
            height: options.height || 512,
            num_outputs: options.num_outputs || 1,
            num_inference_steps: options.num_inference_steps || 4,
            output_format: 'png'
          }
        }
      )

      console.log('[Replicate] Raw output type:', typeof output)
      console.log('[Replicate] Is array:', Array.isArray(output))

      // 收集图片字节数据
      const chunks: Uint8Array[] = []

      // 检查输出是否是异步迭代器（ReadableStream）
      if (output && typeof output === 'object' && Symbol.asyncIterator in output) {
        console.log('[Replicate] Processing async iterator...')
        for await (const chunk of output as AsyncIterable<any>) {
          if (chunk instanceof Uint8Array) {
            chunks.push(chunk)
          }
        }
      }
      // 如果是数组
      else if (Array.isArray(output)) {
        console.log('[Replicate] Processing array output...')
        for (const item of output) {
          // 检查数组元素是否是异步迭代器
          if (item && typeof item === 'object' && Symbol.asyncIterator in item) {
            console.log('[Replicate] Found async iterator in array...')
            for await (const chunk of item as AsyncIterable<any>) {
              if (chunk instanceof Uint8Array) {
                chunks.push(chunk)
              }
            }
            break
          }
        }
      }

      if (chunks.length === 0) {
        throw new Error('No image data received from Replicate')
      }

      // 合并所有字节数据
      const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0)
      const imageBuffer = Buffer.alloc(totalLength)
      let offset = 0
      for (const chunk of chunks) {
        imageBuffer.set(chunk, offset)
        offset += chunk.length
      }

      console.log(`[Replicate] ✓ Received ${chunks.length} chunks, total ${imageBuffer.length} bytes`)

      // 上传到 Supabase
      const imageUrl = await uploadImageToSupabase(imageBuffer, generationId, mood)

      return imageUrl
    } catch (error: any) {
      lastError = error
      const errorMsg = error.message || ''

      // 检查是否是429限流错误
      if (errorMsg.includes('429') || errorMsg.includes('throttled')) {
        const waitTime = error.response?.headers?.['retry-after']
          ? parseInt(error.response.headers['retry-after']) * 1000
          : 10000

        console.log(`[Replicate] Rate limited (attempt ${attempt}/${maxRetries}), waiting ${waitTime/1000}s...`)

        if (attempt < maxRetries) {
          await delay(waitTime)
          continue
        }
      }

      // 检查是否是402余额不足错误
      if (errorMsg.includes('402') || errorMsg.includes('Insufficient credit')) {
        console.error('[Replicate] Insufficient credit - please add funds to your account')
        throw new Error('Insufficient credit. Please add funds at https://replicate.com/account/billing')
      }

      // 其他错误
      console.error(`[Replicate] Generation error (attempt ${attempt}/${maxRetries}):`, error)

      if (attempt < maxRetries) {
        console.log(`[Replicate] Retrying in 3s...`)
        await delay(3000)
        continue
      }
    }
  }

  throw new Error(`Failed to generate image after ${maxRetries} attempts: ${lastError?.message}`)
}

/**
 * 批量生成所有表情图片
 */
export async function generateAllMoods(
  config: AvatarConfig,
  generationId: string,
  options: GenerationOptions = {}
): Promise<Record<Mood, string>> {
  const moods: Mood[] = ['avatar', 'happy', 'angry', 'sad', 'smug']
  const results: Record<string, string> = {}

  console.log('[Replicate] Starting batch generation for', moods.length, 'moods')

  // 串行生成（避免并发限制），每个请求间隔12秒
  for (let i = 0; i < moods.length; i++) {
    const mood = moods[i]

    try {
      console.log(`[Replicate] Generating ${mood} expression (${i + 1}/${moods.length})...`)
      const imageUrl = await generateImage(config, mood, generationId, options)
      results[mood] = imageUrl
      console.log(`[Replicate] ✓ ${mood} completed: ${imageUrl}`)

      // 在下一个请求前等待12秒（避免限流）
      if (i < moods.length - 1) {
        console.log(`[Replicate] Waiting 12s before next generation...`)
        await delay(12000)
      }
    } catch (error: any) {
      console.error(`[Replicate] ✗ ${mood} failed:`, error.message)
      throw new Error(`Failed to generate ${mood} expression: ${error.message}`)
    }
  }

  console.log('[Replicate] Batch generation complete')

  return results as Record<Mood, string>
}

/**
 * 检查生成状态（用于异步生成）
 */
export async function checkGenerationStatus(predictionId: string): Promise<{
  status: string
  output?: string[]
  error?: string
}> {
  try {
    const prediction = await replicate.predictions.get(predictionId)

    return {
      status: prediction.status,
      output: prediction.output as string[] | undefined,
      error: prediction.error?.toString()
    }
  } catch (error: any) {
    throw new Error(`Failed to check status: ${error.message}`)
  }
}

/**
 * 测试 Replicate 连接
 */
export async function testReplicateConnection(): Promise<boolean> {
  try {
    // 尝试获取模型信息
    const model = await replicate.models.get('black-forest-labs', 'flux-schnell')
    console.log('[Replicate] Connection test successful:', model.name)
    return true
  } catch (error: any) {
    console.error('[Replicate] Connection test failed:', error.message)
    return false
  }
}
