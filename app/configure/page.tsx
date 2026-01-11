'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import type { Style, Gender, HairStyle, HairColor, EyeColor, Trait } from '@/types'

const styleNames: Record<Style, string> = {
  genshin: 'Genshin Impact',
  honkai: 'Honkai Star Rail',
  retro90s: 'Retro 90s',
  pixel: 'Pixel Art',
  jjk: 'JJK / Mappa',
  ghibli: 'Studio Ghibli',
  shinkai: 'Makoto Shinkai',
  persona5: 'Persona 5'
}

const hairColors: Array<{ value: HairColor; label: string; gradient: string }> = [
  { value: 'silver', label: 'Silver', gradient: 'linear-gradient(135deg, #e8e8e8, #ffffff)' },
  { value: 'red', label: 'Red', gradient: 'linear-gradient(135deg, #ff6b6b, #ff8787)' },
  { value: 'blue', label: 'Blue', gradient: 'linear-gradient(135deg, #4dabf7, #74c0fc)' },
  { value: 'blonde', label: 'Blonde', gradient: 'linear-gradient(135deg, #ffd43b, #ffe066)' },
  { value: 'black', label: 'Black', gradient: 'linear-gradient(135deg, #2b2b2b, #4a4a4a)' },
  { value: 'pink', label: 'Pink', gradient: 'linear-gradient(135deg, #ff6be8, #ff8af5)' },
  { value: 'brown', label: 'Brown', gradient: 'linear-gradient(135deg, #8b4513, #a0522d)' },
  { value: 'white', label: 'White', gradient: 'linear-gradient(135deg, #f8f9fa, #ffffff)' },
  { value: 'purple', label: 'Purple', gradient: 'linear-gradient(135deg, #cc5de8, #e599f7)' },
  { value: 'green', label: 'Green', gradient: 'linear-gradient(135deg, #51cf66, #8ce99a)' }
]

const eyeColors: Array<{ value: EyeColor; label: string; gradient: string }> = [
  { value: 'blue', label: 'Blue', gradient: 'linear-gradient(135deg, #4dabf7, #74c0fc)' },
  { value: 'red', label: 'Red', gradient: 'linear-gradient(135deg, #ff6b6b, #ff8787)' },
  { value: 'green', label: 'Green', gradient: 'linear-gradient(135deg, #51cf66, #8ce99a)' },
  { value: 'purple', label: 'Purple', gradient: 'linear-gradient(135deg, #cc5de8, #e599f7)' },
  { value: 'gold', label: 'Gold', gradient: 'linear-gradient(135deg, #ffd43b, #ffe066)' },
  { value: 'brown', label: 'Brown', gradient: 'linear-gradient(135deg, #8b4513, #a0522d)' },
  { value: 'pink', label: 'Pink', gradient: 'linear-gradient(135deg, #ff6be8, #ff8af5)' }
]

const traits: Array<{ value: Trait; label: string; emoji: string }> = [
  { value: 'elf-ears', label: 'Elf Ears', emoji: '🧝' },
  { value: 'glasses', label: 'Glasses', emoji: '👓' },
  { value: 'cat-ears', label: 'Cat Ears', emoji: '🐱' },
  { value: 'horns', label: 'Horns', emoji: '👹' },
  { value: 'eyepatch', label: 'Eyepatch', emoji: '👁️' },
  { value: 'wings', label: 'Wings', emoji: '👼' }
]

export default function ConfigurePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const styleParam = searchParams.get('style') as Style || 'genshin'

  const [config, setConfig] = useState({
    style: styleParam,
    gender: 'female' as Gender,
    hairStyle: 'long' as HairStyle,
    hairColor: 'silver' as HairColor,
    eyeColor: 'blue' as EyeColor,
    traits: [] as Trait[],
    moods: ['avatar', 'happy', 'angry', 'sad', 'smug'] as const
  })

  const updateConfig = <K extends keyof typeof config>(key: K, value: typeof config[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const toggleTrait = (trait: Trait) => {
    setConfig(prev => ({
      ...prev,
      traits: prev.traits.includes(trait)
        ? prev.traits.filter(t => t !== trait)
        : [...prev.traits, trait]
    }))
  }

  const handleGenerate = () => {
    localStorage.setItem('characterConfig', JSON.stringify(config))
    router.push('/preview')
  }

  const formatText = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  return (
    <div className="genshin-bg min-h-screen text-white">
      <div className="container mx-auto max-w-[1600px] px-4 py-5">
        <Link
          href="/select-style"
          className="inline-block text-[var(--genshin-gold)] text-lg mb-5"
        >
          ← Change Style
        </Link>

        <header className="text-center p-8 bg-black/40 rounded-2xl mb-8 border-2 border-[rgba(244,213,141,0.3)]">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[var(--genshin-gold)] to-[var(--genshin-blue)] bg-clip-text text-transparent">
            {styleNames[config.style]} Style
          </h1>
          <p className="text-gray-300 text-lg">
            Create your custom Teyvat-inspired character
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Config Panel */}
          <div className="bg-white/8 backdrop-blur-md rounded-2xl p-9 border-2 border-[rgba(244,213,141,0.2)]">
            {/* Gender */}
            <div className="mb-9">
              <h3 className="text-sm mb-5 text-[var(--genshin-gold)] uppercase tracking-widest font-bold">
                Character Gender
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  className={`px-7 py-3.5 rounded-xl text-base font-semibold transition-all border-2 ${
                    config.gender === 'female'
                      ? 'bg-gradient-to-br from-[var(--genshin-gold)] to-[#f39c12] border-[var(--genshin-gold)] text-[#1a1f3a] shadow-[0_5px_20px_rgba(244,213,141,0.4)]'
                      : 'bg-white/5 border-[rgba(244,213,141,0.2)] text-white hover:bg-[rgba(244,213,141,0.15)] hover:border-[var(--genshin-gold)] hover:-translate-y-0.5'
                  }`}
                  onClick={() => updateConfig('gender', 'female')}
                >
                  Female
                </button>
                <button
                  className={`px-7 py-3.5 rounded-xl text-base font-semibold transition-all border-2 ${
                    config.gender === 'male'
                      ? 'bg-gradient-to-br from-[var(--genshin-gold)] to-[#f39c12] border-[var(--genshin-gold)] text-[#1a1f3a] shadow-[0_5px_20px_rgba(244,213,141,0.4)]'
                      : 'bg-white/5 border-[rgba(244,213,141,0.2)] text-white hover:bg-[rgba(244,213,141,0.15)] hover:border-[var(--genshin-gold)] hover:-translate-y-0.5'
                  }`}
                  onClick={() => updateConfig('gender', 'male')}
                >
                  Male
                </button>
              </div>
            </div>

            {/* Hair Style */}
            <div className="mb-9">
              <h3 className="text-sm mb-5 text-[var(--genshin-gold)] uppercase tracking-widest font-bold">
                Hair Style
              </h3>
              <div className="flex flex-wrap gap-3">
                {(['long', 'short', 'ponytail', 'twintails', 'braid'] as HairStyle[]).map(style => (
                  <button
                    key={style}
                    className={`px-7 py-3.5 rounded-xl text-base font-semibold transition-all border-2 ${
                      config.hairStyle === style
                        ? 'bg-gradient-to-br from-[var(--genshin-gold)] to-[#f39c12] border-[var(--genshin-gold)] text-[#1a1f3a] shadow-[0_5px_20px_rgba(244,213,141,0.4)]'
                        : 'bg-white/5 border-[rgba(244,213,141,0.2)] text-white hover:bg-[rgba(244,213,141,0.15)] hover:border-[var(--genshin-gold)] hover:-translate-y-0.5'
                    }`}
                    onClick={() => updateConfig('hairStyle', style)}
                  >
                    {style === 'long' ? 'Long Hair' :
                     style === 'short' ? 'Short Hair' :
                     style === 'ponytail' ? 'Ponytail' :
                     style === 'twintails' ? 'Twin Tails' : 'Braided'}
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Color */}
            <div className="mb-9">
              <h3 className="text-sm mb-5 text-[var(--genshin-gold)] uppercase tracking-widest font-bold">
                Hair Color
              </h3>
              <div className="flex flex-wrap gap-3">
                {hairColors.map(color => (
                  <div
                    key={color.value}
                    className={`w-16 h-16 rounded-full cursor-pointer border-3 transition-all hover:scale-110 ${
                      config.hairColor === color.value
                        ? 'border-[var(--genshin-gold)] shadow-[0_0_25px_rgba(244,213,141,0.6)]'
                        : 'border-transparent'
                    }`}
                    style={{ background: color.gradient, borderWidth: '3px' }}
                    onClick={() => updateConfig('hairColor', color.value)}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            {/* Eye Color */}
            <div className="mb-9">
              <h3 className="text-sm mb-5 text-[var(--genshin-gold)] uppercase tracking-widest font-bold">
                Eye Color
              </h3>
              <div className="flex flex-wrap gap-3">
                {eyeColors.map(color => (
                  <div
                    key={color.value}
                    className={`w-16 h-16 rounded-full cursor-pointer border-3 transition-all hover:scale-110 ${
                      config.eyeColor === color.value
                        ? 'border-[var(--genshin-gold)] shadow-[0_0_25px_rgba(244,213,141,0.6)]'
                        : 'border-transparent'
                    }`}
                    style={{ background: color.gradient, borderWidth: '3px' }}
                    onClick={() => updateConfig('eyeColor', color.value)}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            {/* Special Traits */}
            <div className="mb-9">
              <h3 className="text-sm mb-5 text-[var(--genshin-gold)] uppercase tracking-widest font-bold">
                Special Traits (Optional)
              </h3>
              {traits.map(trait => (
                <label
                  key={trait.value}
                  className="flex items-center p-3.5 bg-white/5 rounded-xl cursor-pointer mb-3 transition-all border-2 border-[rgba(244,213,141,0.2)] hover:bg-[rgba(244,213,141,0.15)] hover:border-[var(--genshin-gold)]"
                >
                  <input
                    type="checkbox"
                    className="w-5 h-5 mr-3"
                    checked={config.traits.includes(trait.value)}
                    onChange={() => toggleTrait(trait.value)}
                  />
                  <span>{trait.label} {trait.emoji}</span>
                </label>
              ))}
            </div>

            {/* Expression Pack */}
            <div className="mb-9">
              <h3 className="text-sm mb-5 text-[var(--genshin-gold)] uppercase tracking-widest font-bold">
                Expression Pack
              </h3>
              <label className="flex items-center p-3.5 bg-white/5 rounded-xl mb-3 border-2 border-[rgba(244,213,141,0.2)] opacity-70">
                <input type="checkbox" className="w-5 h-5 mr-3" checked disabled />
                <span>😊 Portrait (Main Avatar) - Always Included</span>
              </label>
              <label className="flex items-center p-3.5 bg-white/5 rounded-xl mb-3 border-2 border-[rgba(244,213,141,0.2)] opacity-70">
                <input type="checkbox" className="w-5 h-5 mr-3" checked disabled />
                <span>😄 Happy / Victory</span>
              </label>
              <label className="flex items-center p-3.5 bg-white/5 rounded-xl mb-3 border-2 border-[rgba(244,213,141,0.2)] opacity-70">
                <input type="checkbox" className="w-5 h-5 mr-3" checked disabled />
                <span>😠 Angry / Determined</span>
              </label>
              <label className="flex items-center p-3.5 bg-white/5 rounded-xl mb-3 border-2 border-[rgba(244,213,141,0.2)] opacity-70">
                <input type="checkbox" className="w-5 h-5 mr-3" checked disabled />
                <span>😢 Sad / Worried</span>
              </label>
              <label className="flex items-center p-3.5 bg-white/5 rounded-xl border-2 border-[rgba(244,213,141,0.2)] opacity-70">
                <input type="checkbox" className="w-5 h-5 mr-3" checked disabled />
                <span>😏 Confident / Cool</span>
              </label>
            </div>

            <button
              className="w-full px-6 py-5 bg-gradient-to-br from-[var(--genshin-gold)] to-[#f39c12] rounded-2xl text-[#1a1f3a] text-xl font-bold transition-all shadow-[0_10px_30px_rgba(244,213,141,0.4)] hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(244,213,141,0.6)] mt-9"
              onClick={handleGenerate}
            >
              ⚡ Generate Avatar Pack →
            </button>
          </div>

          {/* Preview Panel */}
          <div className="bg-white/8 backdrop-blur-md rounded-2xl p-9 border-2 border-[rgba(244,213,141,0.2)] lg:sticky lg:top-5 h-fit">
            <div className="text-center">
              <h3 className="mb-6 text-[var(--genshin-gold)] text-2xl font-bold">
                ✨ Live Preview
              </h3>
              <div className="aspect-square bg-gradient-to-br from-[rgba(244,213,141,0.15)] to-[rgba(79,195,247,0.15)] rounded-2xl flex items-center justify-center text-8xl mb-6 border-2 border-dashed border-[rgba(244,213,141,0.3)]">
                👤
              </div>
              <p className="text-gray-400 text-sm mb-6">
                AI-generated preview will appear here<br />
                (This is a prototype demo)
              </p>

              <div className="bg-black/40 p-5 rounded-2xl text-sm leading-loose border border-[rgba(244,213,141,0.2)]">
                <p className="text-gray-300">
                  <strong className="text-[var(--genshin-gold)] font-bold">Style:</strong>{' '}
                  {styleNames[config.style]}
                </p>
                <p className="text-gray-300">
                  <strong className="text-[var(--genshin-gold)] font-bold">Gender:</strong>{' '}
                  {formatText(config.gender)}
                </p>
                <p className="text-gray-300">
                  <strong className="text-[var(--genshin-gold)] font-bold">Hair:</strong>{' '}
                  {formatText(config.hairStyle)}, {formatText(config.hairColor)}
                </p>
                <p className="text-gray-300">
                  <strong className="text-[var(--genshin-gold)] font-bold">Eyes:</strong>{' '}
                  {formatText(config.eyeColor)}
                </p>
                <p className="text-gray-300">
                  <strong className="text-[var(--genshin-gold)] font-bold">Traits:</strong>{' '}
                  {config.traits.length > 0 ? config.traits.map(t => formatText(t)).join(', ') : 'None'}
                </p>
                <p className="text-gray-300">
                  <strong className="text-[var(--genshin-gold)] font-bold">Expressions:</strong>{' '}
                  {config.moods.length} expressions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
