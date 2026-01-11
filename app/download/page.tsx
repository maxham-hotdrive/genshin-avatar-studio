'use client'

import Link from 'next/link'

const fileCategories = [
  {
    title: '🖼️ Avatar Images',
    files: [
      'avatar_2048x2048.png (Original HD)',
      'avatar_discord_512x512.png',
      'avatar_twitch_256x256.png',
      'avatar_twitter_400x400.png'
    ]
  },
  {
    title: '😄 Emote: Happy',
    files: [
      'emote_happy_2048x2048.png (Original)',
      'emote_happy_twitch_28x28.png',
      'emote_happy_twitch_56x56.png',
      'emote_happy_twitch_112x112.png'
    ]
  },
  {
    title: '😠 Emote: Angry',
    files: [
      'emote_angry_2048x2048.png (Original)',
      'emote_angry_twitch_28x28.png',
      'emote_angry_twitch_56x56.png',
      'emote_angry_twitch_112x112.png'
    ]
  },
  {
    title: '😢 Emote: Sad',
    files: [
      'emote_sad_2048x2048.png (Original)',
      'emote_sad_twitch_28x28.png',
      'emote_sad_twitch_56x56.png',
      'emote_sad_twitch_112x112.png'
    ]
  },
  {
    title: '😏 Emote: Smug',
    files: [
      'emote_smug_2048x2048.png (Original)',
      'emote_smug_twitch_28x28.png',
      'emote_smug_twitch_56x56.png',
      'emote_smug_twitch_112x112.png'
    ]
  },
  {
    title: '📄 Extras',
    files: [
      'README.txt (Usage instructions)',
      'LICENSE.txt (Commercial usage rights)'
    ]
  }
]

export default function DownloadPage() {
  const handleDownload = () => {
    // In real app, this would download the actual ZIP file
    alert('📥 Download started!\n\nIn the real app, a ZIP file would download now.\n\n(This is a prototype)')

    // Simulate download
    const link = document.createElement('a')
    link.download = 'identity-kit-demo.txt'
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('This is a demo file. In the real app, this would be your complete identity kit ZIP.')
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex items-center justify-center">
      <div className="max-w-[900px] text-center px-5 py-10">
        <div className="text-8xl mb-8 animate-bounce-in">🎉</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-5 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
          Your Identity Kit is Ready!
        </h1>
        <p className="text-gray-300 text-xl mb-10">
          Thank you for your purchase. Download link below.
        </p>

        {/* Download Box */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-10 border-2 border-[rgba(102,126,234,0.3)] my-10">
          <button
            className="w-full px-6 py-6 bg-gradient-to-br from-[#51cf66] to-[#37b24d] rounded-2xl text-white text-2xl font-semibold transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(81,207,102,0.5)] mb-5"
            onClick={handleDownload}
          >
            📥 Download Identity Kit (ZIP)
          </button>
          <div className="text-gray-400 text-sm mt-3">
            identity-kit-hoyoverse-xxx.zip • ~8.5 MB
          </div>
        </div>

        {/* Included Files */}
        <div className="bg-black/30 rounded-2xl p-8 my-8 text-left">
          <h3 className="text-[#667eea] text-xl font-bold mb-5">📦 What's Inside the ZIP:</h3>
          {fileCategories.map((category, index) => (
            <div key={index} className="mb-5">
              <h4 className="text-white font-semibold mb-3">{category.title}</h4>
              <ul className="pl-5 space-y-2">
                {category.files.map((file, fileIndex) => (
                  <li key={fileIndex} className="text-gray-300 text-sm">
                    📄 {file}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Usage Guide */}
        <div className="bg-[rgba(102,126,234,0.1)] border border-[rgba(102,126,234,0.3)] rounded-2xl p-8 my-8 text-left">
          <h3 className="text-[#667eea] text-xl font-bold mb-5">🚀 Quick Start Guide</h3>

          <div className="mb-5">
            <h4 className="text-white font-semibold mb-2">For Discord:</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              1. Open Discord → User Settings → My Account<br />
              2. Click "Change Avatar"<br />
              3. Upload <strong>avatar_discord_512x512.png</strong><br />
              4. For server emojis: Server Settings → Emoji → Upload 112x112 versions
            </p>
          </div>

          <div className="mb-5">
            <h4 className="text-white font-semibold mb-2">For Twitch:</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              1. Go to Creator Dashboard → Settings → Channel<br />
              2. Upload <strong>avatar_twitch_256x256.png</strong> as profile picture<br />
              3. For emotes: Settings → Affiliate/Partner → Emotes<br />
              4. Upload all three sizes (28, 56, 112) for each emote
            </p>
          </div>

          <div className="mb-5">
            <h4 className="text-white font-semibold mb-2">For Twitter/X:</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              1. Profile → Edit Profile<br />
              2. Upload <strong>avatar_twitter_400x400.png</strong>
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">Commercial Usage:</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              ✅ You have full commercial rights to use these images for:<br />
              • Streaming overlays<br />
              • Merchandise (if you're the streamer)<br />
              • Social media branding<br />
              • YouTube thumbnails<br />
              <br />
              ❌ You may NOT:<br />
              • Resell the raw images to others<br />
              • Claim you created them manually
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 my-10">
          <Link
            href="/"
            className="flex-1 px-6 py-5 bg-white/10 rounded-xl text-white font-semibold transition-all hover:bg-white/15 border border-white/20"
          >
            🏠 Back to Home
          </Link>
          <Link
            href="/configure"
            className="flex-1 px-6 py-5 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-xl text-white font-semibold transition-all hover:-translate-y-0.5"
          >
            ✨ Create Another Kit
          </Link>
        </div>

        {/* Thank You */}
        <div className="bg-white/5 rounded-2xl p-8 my-12">
          <h3 className="text-xl font-bold mb-4">💙 Thank You!</h3>
          <p className="text-gray-300 text-sm leading-loose">
            We hope you love your new identity kit! If you have any issues or questions,
            please contact us at support@animeidentitykit.com<br /><br />
            <strong>Need changes?</strong> Email us within 7 days for a free regeneration or full refund.<br /><br />
            <strong>Share your creation!</strong> Tag us on Twitter @AnimeIdentityKit for a chance to be featured!
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.8s;
        }
      `}</style>
    </div>
  )
}
