# Genshin Avatar Studio

Professional Genshin Impact style avatar generator with multi-platform support.

## Overview

Create authentic Genshin Impact character avatars optimized for 18+ platforms including Discord, Steam, Twitch, YouTube, PlayStation, Xbox, and more. Each generation produces a complete avatar pack with organized folders and bonus wallpapers.

## Features

- ⚔️ **Official Genshin Art Style** - Authentic miHoYo character design aesthetic
- 🌟 **18+ Platform Sizes** - Pre-optimized for all major gaming and social platforms
- ⚡ **2-Minute Generation** - Fast AI-powered character creation
- 🎨 **Full Customization** - Gender, hairstyles, colors, fantasy traits
- 💯 **ZIP Download Package** - Organized folders with README and license

## Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **AI Model**: FLUX.1-schnell via Replicate
- **Database**: Supabase (PostgreSQL + Storage)
- **Image Processing**: Sharp
- **Payments**: Stripe (planned)
- **Styling**: TailwindCSS 4

## Getting Started

### Prerequisites

```bash
Node.js 18+
npm or yarn
```

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys
```

### Environment Variables

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

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
anime-identity-kit/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── generate-avatar-pack/ # Main generation endpoint
│   │   ├── generate/             # Legacy multi-mood endpoint
│   │   └── status/               # Generation status check
│   ├── create/                   # Character creator page
│   ├── preview/                  # Generation preview page
│   └── page.tsx                  # Landing page
├── lib/
│   ├── image/                    # Image processing
│   │   ├── processor.ts          # Multi-size generation
│   │   └── packager.ts           # ZIP packaging
│   ├── prompts/                  # AI prompt engineering
│   │   └── generator.ts          # Genshin-optimized prompts
│   ├── replicate/                # Replicate API client
│   │   └── client.ts             # FLUX.1 integration
│   └── supabase/                 # Database & storage
│       ├── admin.ts              # Server-side client
│       └── client.ts             # Browser client
├── types/
│   └── index.ts                  # TypeScript definitions
└── public/                       # Static assets
```

## Documentation

- [Product Requirements (PRD)](./PRD.md) - Complete product specification
- [Implementation Guide](./IMPLEMENTATION.md) - Technical architecture
- [Avatar Pack Plan](./AVATAR-PACK-PLAN.md) - Product strategy

## API Endpoints

### POST /api/generate-avatar-pack

Generate complete avatar pack with 18+ platform sizes.

**Request:**
```json
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

**Response:**
```json
{
  "success": true,
  "generationId": "uuid",
  "images": {
    "original": "https://...",
    "zip": "https://..."
  },
  "status": "completed"
}
```

### GET /api/status/:id

Check generation status.

**Response:**
```json
{
  "id": "uuid",
  "status": "completed",
  "images": { "original": "...", "zip": "..." },
  "createdAt": "2026-01-12T...",
  "completedAt": "2026-01-12T..."
}
```

## Deployment

### Vercel

```bash
# Link to Vercel
vercel link

# Set environment variables
vercel env add REPLICATE_API_TOKEN
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Deploy
vercel --prod
```

### Supabase Setup

1. Create Supabase project
2. Run database migrations (see IMPLEMENTATION.md)
3. Create `generated-images` storage bucket (public)
4. Set up RLS policies

## License

This project is for educational purposes. Not affiliated with miHoYo/HoYoverse.

Genshin Impact is a trademark of miHoYo/HoYoverse. This tool creates fan art following miHoYo's [fan creation guidelines](https://www.hoyolab.com/article/1088506).

## Contact

For questions or support, please open an issue on GitHub.

---

**Note**: This is an MVP focused exclusively on Genshin Impact style. Future phases may include Honkai: Star Rail support.
