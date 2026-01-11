// ===================================
// 核心类型定义
// ===================================

export type Style =
  | 'genshin'
  | 'honkai'
  | 'retro90s'
  | 'pixel'
  | 'jjk'
  | 'ghibli'
  | 'shinkai'
  | 'persona5'

export type Gender = 'male' | 'female'

export type HairStyle =
  | 'long'
  | 'short'
  | 'ponytail'
  | 'twintails'
  | 'braid'

export type HairColor =
  | 'black'
  | 'brown'
  | 'blonde'
  | 'silver'
  | 'white'
  | 'red'
  | 'pink'
  | 'blue'
  | 'purple'
  | 'green'

export type EyeColor =
  | 'blue'
  | 'green'
  | 'brown'
  | 'red'
  | 'purple'
  | 'gold'
  | 'pink'

export type Trait =
  | 'glasses'
  | 'eyepatch'
  | 'elf-ears'
  | 'horns'
  | 'wings'
  | 'cat-ears'

export type Mood =
  | 'avatar'    // 中性头像
  | 'happy'
  | 'angry'
  | 'sad'
  | 'smug'

export interface AvatarConfig {
  style: Style
  gender: Gender
  hairStyle: HairStyle
  hairColor: HairColor
  eyeColor: EyeColor
  traits: Trait[]
  moods: Mood[]
}

export interface GenerationResult {
  id: string
  userId: string
  config: AvatarConfig
  images: {
    avatar: string      // 主头像URL
    happy: string       // 开心表情URL
    angry: string       // 生气表情URL
    sad: string         // 悲伤表情URL
    smug: string        // 得意表情URL
  }
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: string
  paid: boolean
}

export interface PaymentIntent {
  id: string
  clientSecret: string
  amount: number
  currency: string
}

export interface User {
  id: string
  email: string
  generationCount: number
  isPro: boolean
  createdAt: string
}

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          generation_count: number
          is_pro: boolean
          stripe_customer_id: string | null
          last_login: string | null
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          generation_count?: number
          is_pro?: boolean
          stripe_customer_id?: string | null
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          generation_count?: number
          is_pro?: boolean
          stripe_customer_id?: string | null
          last_login?: string | null
        }
      }
      generations: {
        Row: {
          id: string
          user_id: string
          style: string
          config: AvatarConfig
          images: Record<string, string> | null
          status: string
          created_at: string
          completed_at: string | null
          paid: boolean
          payment_id: string | null
          replicate_id: string | null
          error_message: string | null
        }
        Insert: {
          id?: string
          user_id: string
          style: string
          config: AvatarConfig
          images?: Record<string, string> | null
          status?: string
          created_at?: string
          completed_at?: string | null
          paid?: boolean
          payment_id?: string | null
          replicate_id?: string | null
          error_message?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          style?: string
          config?: AvatarConfig
          images?: Record<string, string> | null
          status?: string
          created_at?: string
          completed_at?: string | null
          paid?: boolean
          payment_id?: string | null
          replicate_id?: string | null
          error_message?: string | null
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string | null
          generation_id: string | null
          stripe_payment_intent_id: string
          stripe_checkout_session_id: string | null
          amount: number
          currency: string
          status: string
          created_at: string
          completed_at: string | null
          metadata: Record<string, any> | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          generation_id?: string | null
          stripe_payment_intent_id: string
          stripe_checkout_session_id?: string | null
          amount: number
          currency?: string
          status?: string
          created_at?: string
          completed_at?: string | null
          metadata?: Record<string, any> | null
        }
        Update: {
          id?: string
          user_id?: string | null
          generation_id?: string | null
          stripe_payment_intent_id?: string
          stripe_checkout_session_id?: string | null
          amount?: number
          currency?: string
          status?: string
          created_at?: string
          completed_at?: string | null
          metadata?: Record<string, any> | null
        }
      }
      analytics_events: {
        Row: {
          id: string
          user_id: string | null
          event_type: string
          event_data: Record<string, any> | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          event_type: string
          event_data?: Record<string, any> | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          event_type?: string
          event_data?: Record<string, any> | null
          created_at?: string
        }
      }
    }
  }
}
