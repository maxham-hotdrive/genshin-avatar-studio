import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Genshin Avatar Studio | Professional Genshin Impact Character Creator',
  description: 'Create authentic Genshin Impact style avatars for all platforms. Get 18+ optimized sizes (Discord, Twitch, Steam, YouTube) in one generation. Professional miHoYo art style.',
  keywords: 'genshin impact avatar generator, genshin character creator, anime avatar maker, discord pfp, twitch profile picture, genshin impact art style, miHoYo character design',
}

export default function Home() {
  return (
    <div className="genshin-bg min-h-screen text-white">
      <div className="container mx-auto px-4 py-5">
        {/* SEO Header */}
        <header className="text-center bg-black/30 backdrop-blur-sm rounded-2xl p-6 mb-5">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[var(--genshin-gold)] via-[var(--genshin-blue)] to-[var(--genshin-gold)] bg-clip-text text-transparent leading-tight">
            Genshin Avatar Studio
          </h1>
          <p className="text-xl text-[var(--genshin-gold)] mb-3 font-semibold">
            Professional Genshin Impact Character Creator | 18+ Platform-Ready Avatars
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {['Official Art Style', 'Multi-Platform', '18+ Sizes Included', 'Instant Download'].map((badge) => (
              <span key={badge} className="bg-[rgba(244,213,141,0.15)] border border-[var(--genshin-gold)] px-4 py-2 rounded-full text-sm text-[var(--genshin-gold)] font-semibold">
                {badge}
              </span>
            ))}
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center py-16 relative">
          <div className="absolute top-5 left-[20%] text-4xl text-[var(--genshin-gold)] opacity-30 float-animation">✦</div>
          <div className="absolute bottom-5 right-[20%] text-3xl text-[var(--genshin-blue)] opacity-30 float-animation" style={{ animationDelay: '1s' }}>✧</div>

          <h2 className="text-4xl md:text-5xl font-bold mb-5" style={{ textShadow: '0 0 20px rgba(244, 213, 141, 0.5)' }}>
            Create Your Teyvat Identity
          </h2>
          <p className="text-2xl text-gray-300 mb-10">
            Professional Genshin Impact avatars for Discord, Steam, Twitch & more
          </p>
          <Link
            href="/select-style"
            className="inline-block px-12 py-5 bg-gradient-to-r from-[var(--genshin-gold)] to-[#f39c12] text-[#1a1f3a] rounded-full text-2xl font-bold border-2 border-[var(--genshin-gold)] shadow-[0_10px_30px_rgba(244,213,141,0.4)] hover:shadow-[0_15px_40px_rgba(244,213,141,0.6)] hover:-translate-y-1 transition-all relative overflow-hidden group"
          >
            <span className="relative z-10">Create Avatar Pack →</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
          </Link>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-16">
          {features.map((feature, index) => (
            <article
              key={index}
              className="bg-white/8 backdrop-blur-md p-8 rounded-3xl border-2 border-[rgba(244,213,141,0.2)] hover:border-[var(--genshin-gold)] hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(244,213,141,0.3)] transition-all relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle,rgba(244,213,141,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-3 text-[var(--genshin-gold)]">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </article>
          ))}
        </section>

        {/* Final CTA */}
        <div className="text-center my-20">
          <h2 className="text-4xl font-bold mb-5 text-[var(--genshin-gold)]">
            Ready to Create Your Genshin Avatar Pack?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join Genshin Impact players worldwide with professional avatars
          </p>
          <Link href="/select-style" className="inline-block px-12 py-5 bg-gradient-to-r from-[var(--genshin-gold)] to-[#f39c12] text-[#1a1f3a] rounded-full text-2xl font-bold border-2 border-[var(--genshin-gold)] shadow-[0_10px_30px_rgba(244,213,141,0.4)] hover:shadow-[0_15px_40px_rgba(244,213,141,0.6)] hover:-translate-y-1 transition-all">
            Start Creating →
          </Link>
        </div>

        {/* Footer */}
        <footer className="text-center py-10 text-gray-400 border-t-2 border-[rgba(244,213,141,0.2)] mt-20">
          <p>&copy; 2026 Genshin Avatar Studio. Not affiliated with miHoYo/HoYoverse.</p>
          <div className="mt-4 space-x-4">
            {['Discord Avatars', 'Twitch Profiles', 'Steam Avatars', 'Multi-Platform Pack'].map((link) => (
              <Link key={link} href="#" className="text-[var(--genshin-gold)] hover:underline">{link}</Link>
            ))}
          </div>
          <div className="mt-4 space-x-4">
            {['Privacy Policy', 'Terms of Service', 'Contact'].map((link) => (
              <Link key={link} href="#" className="text-[var(--genshin-gold)] hover:underline">{link}</Link>
            ))}
          </div>
        </footer>
      </div>
    </div>
  )
}

const features = [
  { icon: '⚔️', title: 'Official Genshin Art Style', description: "Authentic Genshin Impact aesthetic matching miHoYo's vibrant cel-shaded character designs. Professional game illustration quality." },
  { icon: '🌟', title: '18+ Platform Sizes', description: 'Complete avatar pack with Discord (128px), Steam (184px), Twitch (256px), YouTube (800px), and 14+ more optimized sizes in one generation.' },
  { icon: '⚡', title: '2-Minute Generation', description: 'AI-powered instant character creation with consistent Genshin Impact style. No complex prompts or design skills needed.' },
  { icon: '🎮', title: 'All Gaming Platforms', description: 'Pre-sized for Discord, Steam, Xbox, PlayStation, Nintendo Switch, Epic Games, and all major gaming platforms. Download and use immediately.' },
  { icon: '🎨', title: 'Full Customization', description: 'Choose gender, hairstyles, hair colors, eye colors, and fantasy traits (elf ears, cat ears, horns, wings) for your unique Teyvat character.' },
  { icon: '💯', title: 'ZIP Download Package', description: 'Get organized folders with 18+ avatars + 2 wallpapers (mobile & desktop). Includes README with usage tips and license info.' }
]
