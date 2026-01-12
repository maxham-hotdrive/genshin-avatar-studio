'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Generation {
  id: string
  status: string
  zip_url: string | null
  paid: boolean
  config: any
  created_at: string
}

interface Payment {
  id: string
  status: string
  amount: number
  currency: string
  paid_at: string | null
  customer_email: string | null
}

export default function DownloadPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const generationId = searchParams.get('generation_id')
  const sessionId = searchParams.get('session_id')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [generation, setGeneration] = useState<Generation | null>(null)
  const [payment, setPayment] = useState<Payment | null>(null)
  const [downloadStarted, setDownloadStarted] = useState(false)

  useEffect(() => {
    if (!generationId) {
      setError('Missing generation ID')
      setLoading(false)
      return
    }

    verifyAccessAndLoadData()
  }, [generationId, sessionId])

  const verifyAccessAndLoadData = async () => {
    try {
      setLoading(true)

      // Fetch generation data
      const { data: genData, error: genError } = await supabase
        .from('generations')
        .select('*')
        .eq('id', generationId)
        .single()

      if (genError || !genData) {
        setError('Generation not found')
        setLoading(false)
        return
      }

      // Check if generation is completed
      if (genData.status !== 'completed') {
        setError('Generation is not completed yet')
        setLoading(false)
        return
      }

      // Check if generation is paid
      if (!genData.paid) {
        setError('This generation has not been paid for')
        setLoading(false)
        return
      }

      // Fetch payment data
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('generation_id', generationId)
        .eq('status', 'succeeded')
        .single()

      if (paymentError || !paymentData) {
        setError('Payment not found or not completed')
        setLoading(false)
        return
      }

      setGeneration(genData)
      setPayment(paymentData)
      setLoading(false)

    } catch (err) {
      console.error('Error verifying access:', err)
      setError('Failed to verify access')
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!generation?.zip_url) {
      setError('Download URL not available')
      return
    }

    try {
      setDownloadStarted(true)

      // Get signed URL from Supabase Storage
      const urlParts = generation.zip_url.split('/')
      const fileName = urlParts[urlParts.length - 1]
      const bucketName = 'avatar-packs'

      const { data, error } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(fileName, 3600) // Valid for 1 hour

      if (error || !data) {
        setError('Failed to generate download link')
        setDownloadStarted(false)
        return
      }

      // Trigger download
      window.location.href = data.signedUrl

    } catch (err) {
      console.error('Download error:', err)
      setError('Failed to start download')
      setDownloadStarted(false)
    }
  }

  if (loading) {
    return (
      <div className="genshin-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--genshin-gold)] mx-auto mb-4"></div>
          <p className="text-white text-lg">Verifying your access...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="genshin-bg min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-red-500/10 border-2 border-red-500 rounded-2xl p-8 mb-6">
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-white mb-3">Access Denied</h1>
            <p className="text-gray-300 mb-6">{error}</p>
          </div>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-[var(--genshin-gold)] to-[var(--genshin-blue)] text-white font-bold px-8 py-3 rounded-full transition-transform hover:scale-105"
          >
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="genshin-bg min-h-screen text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-[var(--genshin-gold)] to-[var(--genshin-blue)] bg-clip-text text-transparent">
              Payment Successful!
            </h1>
            <p className="text-xl text-gray-300">
              Your Genshin Impact Avatar Pack is ready to download
            </p>
          </div>

          {/* Download Card */}
          <div className="bg-white/8 backdrop-blur-md rounded-2xl p-8 border-2 border-[var(--genshin-gold)] mb-8">
            <h2 className="text-2xl font-bold mb-6 text-[var(--genshin-gold)]">
              📦 Your Avatar Pack
            </h2>

            {/* Order Details */}
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400">Order ID</span>
                <span className="text-white font-mono text-sm">{payment?.id.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400">Amount Paid</span>
                <span className="text-white font-bold">${(payment?.amount || 0) / 100} {payment?.currency.toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400">Payment Date</span>
                <span className="text-white">{payment?.paid_at ? new Date(payment.paid_at).toLocaleDateString() : 'N/A'}</span>
              </div>
              {payment?.customer_email && (
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-gray-400">Receipt sent to</span>
                  <span className="text-white">{payment.customer_email}</span>
                </div>
              )}
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={downloadStarted}
              className="w-full bg-gradient-to-r from-[var(--genshin-gold)] to-[var(--genshin-blue)] text-white font-bold px-8 py-4 rounded-full transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloadStarted ? 'Starting Download...' : '⬇️ Download Avatar Pack (ZIP)'}
            </button>

            <p className="text-sm text-gray-400 mt-4 text-center">
              The download link is valid for 1 hour
            </p>
          </div>

          {/* What's Included */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-[rgba(244,213,141,0.2)] mb-8">
            <h3 className="text-xl font-bold mb-4 text-[var(--genshin-gold)]">
              📋 What's Included
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-[var(--genshin-gold)]">✓</span>
                <div>
                  <div className="font-semibold text-white">Gaming Platforms (5)</div>
                  <div className="text-gray-400">Steam, Xbox, PlayStation, Epic, Nintendo</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[var(--genshin-gold)]">✓</span>
                <div>
                  <div className="font-semibold text-white">Social Media (6)</div>
                  <div className="text-gray-400">Discord, Twitter, Instagram, Facebook, LinkedIn, TikTok</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[var(--genshin-gold)]">✓</span>
                <div>
                  <div className="font-semibold text-white">Streaming (3)</div>
                  <div className="text-gray-400">Twitch, YouTube, Kick</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[var(--genshin-gold)]">✓</span>
                <div>
                  <div className="font-semibold text-white">High-Res & Wallpapers (5)</div>
                  <div className="text-gray-400">4K, Transparent, Print, Mobile, Desktop</div>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Guide */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-[rgba(244,213,141,0.2)] mb-8">
            <h3 className="text-xl font-bold mb-4 text-[var(--genshin-gold)]">
              📖 Quick Start Guide
            </h3>
            <ol className="space-y-3 text-gray-300">
              <li className="flex gap-3">
                <span className="font-bold text-[var(--genshin-gold)]">1.</span>
                <span>Extract the ZIP file to access all 20 avatar files</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-[var(--genshin-gold)]">2.</span>
                <span>Navigate to the folder for your desired platform (e.g., 01-social-media)</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-[var(--genshin-gold)]">3.</span>
                <span>Upload the avatar to your profile (file names indicate platform and size)</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-[var(--genshin-gold)]">4.</span>
                <span>Read the included README.txt for detailed usage instructions</span>
              </li>
            </ol>
          </div>

          {/* License Info */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-[rgba(244,213,141,0.2)] mb-8">
            <h3 className="text-lg font-bold mb-2 text-[var(--genshin-gold)]">
              📜 Commercial License
            </h3>
            <p className="text-sm text-gray-400">
              You have full rights to use this avatar for personal and commercial purposes.
              This includes streaming, content creation, and merchandise. See README.txt for full terms.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-block text-center bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-full transition-all"
            >
              Create Another Avatar
            </Link>
            <a
              href="mailto:support@example.com"
              className="inline-block text-center bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-full transition-all"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
