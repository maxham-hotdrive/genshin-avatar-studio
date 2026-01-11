'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { Mood } from '@/types'

const statusMessages = [
  'Initializing AI...',
  'Loading Hoyoverse style model...',
  'Generating avatar portrait...',
  'Creating happy emote...',
  'Creating angry emote...',
  'Creating sad emote...',
  'Creating smug emote...',
  'Finalizing images...',
  'Complete!'
]

export default function PreviewPage() {
  const router = useRouter()
  const [stage, setStage] = useState<'generating' | 'preview' | 'error'>('generating')
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState('Initializing AI...')
  const [generationId, setGenerationId] = useState<string | null>(null)
  const [images, setImages] = useState<Record<Mood, string> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    // Prevent duplicate generations
    if (isGenerating) return

    // Load config from localStorage
    const configStr = localStorage.getItem('characterConfig')
    if (!configStr) {
      setError('No character configuration found. Please start from the configure page.')
      setStage('error')
      return
    }

    const config = JSON.parse(configStr)

    // Start real AI generation
    setIsGenerating(true)
    startGeneration(config)
  }, [])

  const startGeneration = async (config: any) => {
    try {
      setStatusText('Initializing AI generation...')
      setProgress(5)

      // Call generate API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          config
          // userId is optional - will be null for anonymous users
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Generation failed')
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Generation failed')
      }

      setGenerationId(data.generationId)
      setImages(data.images)

      // Generation complete!
      setStatusText('All images generated successfully!')
      setProgress(100)

      // Show preview immediately
      setTimeout(() => {
        setStage('preview')
      }, 500)

    } catch (err) {
      console.error('Generation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate images')
      setStage('error')
    }
  }

  const handlePayment = () => {
    if (generationId) {
      // Store generation ID for download page
      localStorage.setItem('generationId', generationId)
    }
    // In real app, this would call Stripe API
    alert('🎉 Payment Successful!\n\nRedirecting to download page...')
    setTimeout(() => {
      router.push('/download')
    }, 1000)
  }

  if (stage === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex items-center justify-center">
        <div className="max-w-[600px] text-center px-5 py-10">
          <div className="text-6xl mb-5">⚠️</div>
          <h1 className="text-3xl font-bold mb-5">Generation Failed</h1>
          <p className="text-gray-300 mb-8">{error}</p>
          <Link
            href="/configure"
            className="inline-block px-8 py-4 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-xl text-white font-semibold transition-all hover:-translate-y-1"
          >
            ← Try Again
          </Link>
        </div>
      </div>
    )
  }

  if (stage === 'generating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex items-center justify-center">
        <div className="max-w-[900px] text-center px-5 py-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-5 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            ✨ Generating Your Identity Kit
          </h1>

          <div className="w-20 h-20 border-8 border-[rgba(102,126,234,0.2)] border-t-[#667eea] rounded-full animate-spin mx-auto my-10"></div>

          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden my-8">
            <div
              className="h-full bg-gradient-to-r from-[#667eea] to-[#764ba2] transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="text-gray-300 text-lg mt-5">
            {statusText}
          </div>

          <p className="text-gray-500 text-sm mt-4">
            This may take 30-60 seconds. Please don't close this page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex items-center justify-center">
      <div className="max-w-[900px] text-center px-5 py-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
          🎉 Your Identity Kit is Ready!
        </h1>
        <p className="text-gray-300 text-lg mb-10">
          Here's a preview with watermarks
        </p>

        {/* Preview Grid with actual images */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 my-10">
          {images ? (
            Object.entries(images).map(([mood, imageUrl]) => (
              <div
                key={mood}
                className="aspect-square bg-white/5 rounded-2xl border-2 border-[rgba(102,126,234,0.3)] relative overflow-hidden"
              >
                <Image
                  src={imageUrl}
                  alt={mood}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                {/* Watermark overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="text-white text-2xl font-bold opacity-50 rotate-[-30deg]">
                    PREVIEW
                  </div>
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 px-3 py-1 rounded text-xs capitalize">
                  {mood}
                </div>
              </div>
            ))
          ) : (
            [
              { emoji: '😊', label: 'Avatar' },
              { emoji: '😄', label: 'Happy' },
              { emoji: '😠', label: 'Angry' },
              { emoji: '😢', label: 'Sad' },
              { emoji: '😏', label: 'Smug' }
            ].map((item) => (
              <div
                key={item.label}
                className="aspect-square bg-white/5 rounded-2xl flex items-center justify-center text-6xl md:text-7xl border-2 border-[rgba(102,126,234,0.3)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[rgba(102,126,234,0.1)] to-transparent animate-shimmer"></div>
                {item.emoji}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 px-3 py-1 rounded text-xs">
                  {item.label}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Watermark Notice */}
        <div className="bg-[rgba(255,193,7,0.2)] border border-[rgba(255,193,7,0.5)] rounded-xl p-5 my-8 text-[#ffc107]">
          ⚠️ <strong>Free Preview</strong> - Images above have watermarks and low resolution.<br />
          Unlock HD, watermark-free versions + all Discord/Twitch sizes below.
        </div>

        {/* Payment Box */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-10 border-2 border-[rgba(102,126,234,0.3)] mt-10">
          <h2 className="text-2xl font-bold mb-3">Unlock Full HD Identity Kit</h2>
          <div className="text-5xl md:text-6xl font-extrabold my-5 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            $4.99
          </div>
          <div className="text-gray-300 mb-8">
            One-time payment • Instant download
          </div>

          <div className="text-left my-8">
            <h3 className="text-lg font-bold mb-4">What You Get:</h3>
            <ul className="space-y-3">
              {[
                '5 High-Resolution Images (2048x2048)',
                'No Watermarks',
                'Discord Sizes (512x512, 600x240 banner)',
                'Twitch Emotes (28x28, 56x56, 112x112)',
                'Twitter/YouTube/TikTok Sizes',
                'All Files in One ZIP',
                'Commercial Usage Rights',
                'Lifetime Access'
              ].map((item, index) => (
                <li
                  key={index}
                  className="pb-3 border-b border-white/10 text-gray-300"
                >
                  <span className="text-[#51cf66] font-bold mr-3">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <button
            className="w-full px-6 py-5 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-2xl text-white text-xl font-semibold transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(102,126,234,0.5)] mt-5"
            onClick={handlePayment}
          >
            💳 Unlock for $4.99
          </button>

          <div className="mt-5 text-gray-400 text-sm">
            🔒 Secure Checkout • 💯 7-Day Money Back Guarantee
          </div>
        </div>

        <Link
          href="/configure"
          className="inline-block text-[#667eea] mt-5 hover:underline"
        >
          ← Generate Another Character
        </Link>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          to {
            transform: translateX(100%) translateY(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}
