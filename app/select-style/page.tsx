import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Avatar - Genshin Avatar Studio',
  description: 'Create your professional Genshin Impact style avatar. Get 18+ platform-ready sizes in one generation.',
  keywords: 'genshin impact avatar, character creator, anime avatar, miHoYo art style',
}

interface StyleData {
  id: string
  name: string
  icon: string
  description: string
  tags: string[]
}

const styles: StyleData[] = [
  {
    id: 'genshin',
    name: 'Genshin Impact',
    icon: '⚔️',
    description: 'Authentic Genshin Impact style with vibrant colors, cel-shaded rendering, and detailed character designs. Perfect for Travelers and adventurers.',
    tags: ['Vibrant', 'Cel-Shaded', 'Fantasy']
  }
]

export default function SelectStyle() {
  return (
    <div className="genshin-bg min-h-screen text-white">
      <div className="container mx-auto px-4 py-5">
        <Link
          href="/"
          className="inline-block text-[var(--genshin-gold)] text-lg mb-8 transition-transform hover:-translate-x-1"
        >
          ← Back to Home
        </Link>

        <header className="text-center py-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-[var(--genshin-gold)] to-[var(--genshin-blue)] bg-clip-text text-transparent">
            Create Your Genshin Impact Avatar
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            Professional character avatar optimized for 18+ gaming platforms
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <span className="text-[var(--genshin-gold)]">⚡</span>
              2-minute generation
            </span>
            <span className="flex items-center gap-2">
              <span className="text-[var(--genshin-gold)]">📦</span>
              20 files in one pack
            </span>
            <span className="flex items-center gap-2">
              <span className="text-[var(--genshin-gold)]">🎮</span>
              Discord, Steam, Twitch & more
            </span>
          </div>
        </header>

        <div className="max-w-2xl mx-auto mt-12">
          {styles.map((style) => (
            <StyleCard key={style.id} style={style} />
          ))}
        </div>

        <div className="mt-16 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-[var(--genshin-gold)]">
            📦 What You'll Get
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-[rgba(244,213,141,0.2)]">
              <div className="text-3xl mb-3">🎮</div>
              <h3 className="font-bold text-white mb-2">Gaming Platforms</h3>
              <p className="text-sm text-gray-400">Steam, Xbox, PlayStation, Epic Games, Nintendo Switch</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-[rgba(244,213,141,0.2)]">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="font-bold text-white mb-2">Social & Streaming</h3>
              <p className="text-sm text-gray-400">Discord, Twitch, YouTube, Twitter/X, Instagram, TikTok</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-[rgba(244,213,141,0.2)]">
              <div className="text-3xl mb-3">🖼️</div>
              <h3 className="font-bold text-white mb-2">High-Res & Wallpapers</h3>
              <p className="text-sm text-gray-400">4K transparent, print quality, mobile & desktop wallpapers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StyleCard({ style }: { style: StyleData }) {
  return (
    <Link
      href={`/configure?style=${style.id}`}
      className="bg-white/8 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer transition-all border-2 border-transparent hover:-translate-y-3 hover:border-[var(--genshin-gold)] hover:shadow-[0_20px_40px_rgba(244,213,141,0.3)] relative group block"
    >
      <div className="w-full aspect-[4/3] bg-gradient-to-br from-[rgba(244,213,141,0.2)] to-[rgba(79,195,247,0.2)] flex items-center justify-center text-7xl relative border-b-2 border-[rgba(244,213,141,0.2)]">
        {style.icon}
      </div>

      <div className="p-8">
        <div className="text-2xl font-bold mb-3 text-[var(--genshin-gold)]">
          {style.name}
        </div>
        <div className="text-gray-300 mb-5 leading-relaxed text-sm">
          {style.description}
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {style.tags.map((tag) => (
            <span
              key={tag}
              className="bg-[rgba(244,213,141,0.15)] border border-[rgba(244,213,141,0.3)] text-[var(--genshin-gold)] px-4 py-1.5 rounded-full text-xs font-semibold"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="text-center">
          <span className="inline-block bg-gradient-to-r from-[var(--genshin-gold)] to-[var(--genshin-blue)] text-white font-bold px-8 py-3 rounded-full transition-transform group-hover:scale-105">
            Start Creating →
          </span>
        </div>
      </div>
    </Link>
  )
}
