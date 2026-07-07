export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          plan: 'free' | 'pro' | 'team'
          ai_usage_monthly: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string
          avatar_url?: string | null
          plan?: 'free' | 'pro' | 'team'
          ai_usage_monthly?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          plan?: 'free' | 'pro' | 'team'
          ai_usage_monthly?: Json
          updated_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          style_pack_id: string | null
          template_id: string | null
          status: 'draft' | 'published' | 'archived'
          word_count: number
          views: number
          likes: number
          shares: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          content?: string
          style_pack_id?: string | null
          template_id?: string | null
          status?: 'draft' | 'published' | 'archived'
          word_count?: number
        }
        Update: {
          title?: string
          content?: string
          style_pack_id?: string | null
          template_id?: string | null
          status?: 'draft' | 'published' | 'archived'
          word_count?: number
          updated_at?: string
        }
      }
      style_packs: {
        Row: {
          id: string
          user_id: string | null
          name: string
          description: string
          config: Json
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          description?: string
          config: Json
          is_default?: boolean
        }
        Update: {
          name?: string
          description?: string
          config?: Json
          updated_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          industry: string
          scene: string
          structure: string
          thumbnail_url: string | null
          content_template: string
          style_pack_id: string | null
          use_count: number
          is_pro: boolean
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          category?: string
          industry?: string
          scene?: string
          structure?: string
          thumbnail_url?: string | null
          content_template: string
          style_pack_id?: string | null
          is_pro?: boolean
          is_default?: boolean
        }
        Update: {
          name?: string
          description?: string
          category?: string
          thumbnail_url?: string | null
          use_count?: number
        }
      }
      assets: {
        Row: {
          id: string
          user_id: string
          name: string
          type: 'image' | 'video' | 'audio' | 'document'
          url: string
          size_bytes: number
          mime_type: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: 'image' | 'video' | 'audio' | 'document'
          url: string
          size_bytes: number
          mime_type: string
          metadata?: Json | null
        }
        Update: {
          name?: string
          metadata?: Json | null
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      plan_type: 'free' | 'pro' | 'team'
      article_status: 'draft' | 'published' | 'archived'
      asset_type: 'image' | 'video' | 'audio' | 'document'
    }
  }
}
