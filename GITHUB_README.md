# 🎮 Genshin Avatar Studio

**Professional Genshin Impact character avatar generator with multi-platform support**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Educational-green)](LICENSE)

> Create authentic Genshin Impact style avatars optimized for 18+ platforms in just 2 minutes

---

## ✨ Features

- ⚔️ **Official Genshin Art Style** - Authentic miHoYo character design aesthetic
- 🌟 **18+ Platform Sizes** - Discord, Steam, Twitch, YouTube, PlayStation, Xbox, and more
- ⚡ **2-Minute Generation** - AI-powered instant character creation
- 🎨 **Full Customization** - Gender, hairstyles, hair colors, eye colors, fantasy traits
- 💯 **ZIP Download Package** - 20 files organized in folders with README

---

## 📦 What You Get

Each generation produces a complete avatar pack:

| Category | Files | Platforms |
|----------|-------|-----------|
| **Social Media** | 6 | Discord, Twitter/X, Instagram, Facebook, LinkedIn, TikTok |
| **Gaming** | 5 | Steam, Xbox, PlayStation, Epic Games, Nintendo Switch |
| **Streaming** | 3 | Twitch, YouTube, Kick |
| **Professional** | 3 | High-res, Transparent BG, Print Quality |
| **Wallpapers** | 2 | Mobile (1080x1920), Desktop (1920x1080) |
| **README** | 1 | Usage guide & license |

**Total: 20 ready-to-use files** in organized folders

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Replicate API account
- Supabase project

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/genshin-avatar-studio.git
cd genshin-avatar-studio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **AI Model**: FLUX.1-schnell via Replicate
- **Database**: Supabase (PostgreSQL + Storage)
- **Image Processing**: Sharp
- **Styling**: TailwindCSS 4
- **Language**: TypeScript 5

---

## 📖 Documentation

- [**PRD**](PRD.md) - Complete product requirements
- [**Implementation Guide**](IMPLEMENTATION.md) - Technical architecture
- [**Avatar Pack Plan**](AVATAR-PACK-PLAN.md) - Product strategy
- [**Progress Tracker**](PROGRESS.md) - Development status

---

## 🎯 API Endpoints

### Generate Avatar Pack

```http
POST /api/generate-avatar-pack
Content-Type: application/json

{
  "config": {
    "style": "genshin",
    "gender": "female",
    "hairStyle": "twintails",
    "hairColor": "blonde",
    "eyeColor": "blue",
    "traits": ["cat-ears"],
    "moods": ["avatar"]
  }
}
```

**Response**: Generation ID + ZIP download URL

---

## 💰 Pricing Model

| Feature | Price |
|---------|-------|
| Single Generation | $15-20 |
| Files Included | 20 |
| Platforms Covered | 17+ |
| Wallpapers | 2 |
| Commercial License | ✓ |

**Value**: $0.75-1.00 per file vs $50-150 for custom artist

---

## 🎨 Example Output

```
avatar-pack.zip/
├── README.txt
├── 01-social-media/
│   ├── discord-128.png
│   ├── twitter-400.png
│   └── ... (6 files)
├── 02-gaming/
│   ├── steam-184.png
│   ├── xbox-1080.png
│   └── ... (5 files)
├── 03-streaming/
│   └── ... (3 files)
├── 04-professional/
│   └── ... (3 files)
└── 05-wallpapers/
    └── ... (2 files)
```

---

## 🔒 Environment Variables

Create `.env.local` with:

```bash
# Replicate
REPLICATE_API_TOKEN=r8_xxx

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx

# App
NEXT_PUBLIC_URL=http://localhost:3000
```

---

## 📝 License

This project is for **educational purposes only**. Not affiliated with miHoYo/HoYoverse.

Genshin Impact is a trademark of miHoYo/HoYoverse. This tool creates fan art following miHoYo's [fan creation guidelines](https://www.hoyolab.com/article/1088506).

---

## 🤝 Contributing

This is an MVP project. Contributions, issues, and feature requests are welcome!

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

## 🎯 Roadmap

- [x] MVP - Single avatar generation
- [x] 17+ platform sizes
- [x] Genshin Impact style optimization
- [ ] Stripe payment integration
- [ ] Expression pack (5 moods)
- [ ] Honkai: Star Rail style (Phase 2)

---

**Built with ❤️ using Next.js 16 and Claude Sonnet 4.5**
