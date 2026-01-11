import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Choose Style - Genshin Impact & Honkai Star Rail Avatar Generator',
  description: 'Select your preferred style: Genshin Impact, Honkai Star Rail, or other anime aesthetics. Create custom Discord and Twitch avatars instantly.',
  keywords: 'genshin impact style, honkai star rail style, hoyoverse aesthetic, anime avatar styles',
}

interface StyleData {
  id: string
  name: string
  icon: string
  description: string
  tags: string[]
  popular?: boolean
  available: boolean
}

const styles: StyleData[] = [
  {
    id: 'genshin',
    name: 'Genshin Impact',
    icon: '⚔️',
    description: 'Authentic Genshin Impact style with vibrant colors, cel-shaded rendering, and detailed character designs. Perfect for Travelers and adventurers.',
    tags: ['Vibrant', 'Cel-Shaded', 'Fantasy'],
    popular: true,
    available: true
  },
  {
    id: 'honkai',
    name: 'Honkai Star Rail',
    icon: '🚂',
    description: "Honkai Star Rail's signature sci-fi aesthetic with futuristic elements, cosmic colors, and detailed space-age designs.",
    tags: ['Sci-Fi', 'Cosmic', 'Detailed'],
    available: true
  },
  {
    id: 'retro90s',
    name: 'Retro 90s Anime',
    icon: '📼',
    description: 'Nostalgic 1990s anime aesthetic with VHS grain, soft pastel colors, and classic Sailor Moon vibes.',
    tags: ['Nostalgic', 'Dreamy', 'VHS'],
    available: true
  },
  {
    id: 'pixel',
    name: 'Pixel Art',
    icon: '🕹️',
    description: 'Retro 8-bit game style inspired by classic RPGs. Perfect for indie game lovers and Minecraft players.',
    tags: ['Retro', '8-bit', 'Gaming'],
    available: true
  },
  {
    id: 'jjk',
    name: 'JJK / Mappa',
    icon: '⚡',
    description: 'Jujutsu Kaisen dark fantasy style with rough lines and intense expressions.',
    tags: ['Dark', 'Intense'],
    available: false
  },
  {
    id: 'ghibli',
    name: 'Studio Ghibli',
    icon: '🌿',
    description: "Hayao Miyazaki's watercolor style with peaceful, hand-drawn charm.",
    tags: ['Peaceful', 'Watercolor'],
    available: false
  },
  {
    id: 'shinkai',
    name: 'Makoto Shinkai',
    icon: '🌅',
    description: 'Your Name style with dramatic lighting and wallpaper-quality visuals.',
    tags: ['Cinematic', 'Beautiful'],
    available: false
  },
  {
    id: 'persona5',
    name: 'Persona 5',
    icon: '🎭',
    description: 'Red & black pop art with bold graphic design and minimalist aesthetic.',
    tags: ['Pop Art', 'Bold'],
    available: false
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
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-[var(--genshin-gold)] via-[var(--genshin-blue)] to-[var(--honkai-purple)] bg-clip-text text-transparent">
            Choose Your Avatar Style
          </h1>
          <p className="text-xl text-gray-300">
            Select the Hoyoverse aesthetic that matches your gaming identity
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12">
          {styles.map((style) => (
            <StyleCard key={style.id} style={style} />
          ))}
        </div>
      </div>
    </div>
  )
}

function StyleCard({ style }: { style: StyleData }) {
  const cardContent = (
    <>
      <div className="w-full aspect-[4/3] bg-gradient-to-br from-[rgba(244,213,141,0.2)] to-[rgba(79,195,247,0.2)] flex items-center justify-center text-7xl relative border-b-2 border-[rgba(244,213,141,0.2)]">
        {style.popular && (
          <span className="absolute top-4 right-4 bg-gradient-to-br from-[#ff6b6b] to-[#ff8787] px-4 py-2 rounded-full text-xs font-bold shadow-[0_5px_15px_rgba(255,107,107,0.4)]">
            🔥 MOST POPULAR
          </span>
        )}
        {!style.available && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/85 px-6 py-3 rounded-xl text-lg font-bold border-2 border-[var(--genshin-gold)]">
            COMING SOON
          </div>
        )}
        {style.icon}
      </div>

      <div className="p-8">
        <div className="text-2xl font-bold mb-3 text-[var(--genshin-gold)]">
          {style.name}
        </div>
        <div className="text-gray-300 mb-5 leading-relaxed text-sm">
          {style.description}
        </div>
        <div className="flex flex-wrap gap-2">
          {style.tags.map((tag) => (
            <span
              key={tag}
              className="bg-[rgba(244,213,141,0.15)] border border-[rgba(244,213,141,0.3)] text-[var(--genshin-gold)] px-4 py-1.5 rounded-full text-xs font-semibold"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </>
  )

  if (!style.available) {
    return (
      <div className="bg-white/8 backdrop-blur-md rounded-2xl overflow-hidden border-2 border-transparent opacity-60 cursor-not-allowed relative">
        {cardContent}
      </div>
    )
  }

  return (
    <Link
      href={`/configure?style=${style.id}`}
      className="bg-white/8 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer transition-all border-2 border-transparent hover:-translate-y-3 hover:border-[var(--genshin-gold)] hover:shadow-[0_20px_40px_rgba(244,213,141,0.3)] relative group block"
    >
      {cardContent}
    </Link>
  )
}
