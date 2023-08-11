export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  private: {
    Tables: {
      installation: {
        Row: {
          account: number
          created_at: string
          db_created_at: string
          db_deleted: boolean
          db_deleted_at: string | null
          db_id: number
          db_name: string
          db_updated_at: string
          event_id: string
          event_name: string
          id: number
          sender: number | null
          updated_at: string
        }
        Insert: {
          account: number
          created_at: string
          db_created_at?: string
          db_deleted?: boolean
          db_deleted_at?: string | null
          db_id?: number
          db_name?: string
          db_updated_at: string
          event_id: string
          event_name: string
          id: number
          sender?: number | null
          updated_at: string
        }
        Update: {
          account?: number
          created_at?: string
          db_created_at?: string
          db_deleted?: boolean
          db_deleted_at?: string | null
          db_id?: number
          db_name?: string
          db_updated_at?: string
          event_id?: string
          event_name?: string
          id?: number
          sender?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'installation_user_account'
            columns: ['account']
            referencedRelation: 'user'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'installation_user_sender'
            columns: ['sender']
            referencedRelation: 'user'
            referencedColumns: ['id']
          },
        ]
      }
      page_content: {
        Row: {
          db_blob_name: string
          db_blob_url: string
          db_display_name: string
          db_id: number
          db_user_id: number
          display_name: string
          id: number
          name: string
          node_id: string
          private: boolean
          type: number
        }
        Insert: {
          db_blob_name: string
          db_blob_url: string
          db_display_name: string
          db_id?: number
          db_user_id: number
          display_name: string
          id: number
          name: string
          node_id: string
          private: boolean
          type: number
        }
        Update: {
          db_blob_name?: string
          db_blob_url?: string
          db_display_name?: string
          db_id?: number
          db_user_id?: number
          display_name?: string
          id?: number
          name?: string
          node_id?: string
          private?: boolean
          type?: number
        }
        Relationships: [
          {
            foreignKeyName: 'page_content_db_user_id_fkey'
            columns: ['db_user_id']
            referencedRelation: 'user'
            referencedColumns: ['db_id']
          },
          {
            foreignKeyName: 'page_content_type_fkey'
            columns: ['type']
            referencedRelation: 'page_types'
            referencedColumns: ['id']
          },
        ]
      }
      page_types: {
        Row: {
          created_at: string
          deleted: boolean
          deleted_at: string | null
          id: number
          type: Database['private']['Enums']['enum_page_types']
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted?: boolean
          deleted_at?: string | null
          id?: number
          type: Database['private']['Enums']['enum_page_types']
          updated_at: string
        }
        Update: {
          created_at?: string
          deleted?: boolean
          deleted_at?: string | null
          id?: number
          type?: Database['private']['Enums']['enum_page_types']
          updated_at?: string
        }
        Relationships: []
      }
      user: {
        Row: {
          avatar_url: string
          db_created_at: string
          db_deleted: boolean
          db_deleted_at: string | null
          db_id: number
          db_updated_at: string
          events_url: string
          followers_url: string
          following_url: string
          gists_url: string
          gravatar_id: string
          html_url: string
          id: number
          login: string
          node_id: string
          organizations_url: string
          received_events_url: string
          repos_url: string
          site_admin: boolean
          starred_url: string
          subscriptions_url: string
          type: string
          url: string
        }
        Insert: {
          avatar_url: string
          db_created_at?: string
          db_deleted?: boolean
          db_deleted_at?: string | null
          db_id?: number
          db_updated_at: string
          events_url: string
          followers_url: string
          following_url: string
          gists_url: string
          gravatar_id: string
          html_url: string
          id: number
          login: string
          node_id: string
          organizations_url: string
          received_events_url: string
          repos_url: string
          site_admin: boolean
          starred_url: string
          subscriptions_url: string
          type: string
          url: string
        }
        Update: {
          avatar_url?: string
          db_created_at?: string
          db_deleted?: boolean
          db_deleted_at?: string | null
          db_id?: number
          db_updated_at?: string
          events_url?: string
          followers_url?: string
          following_url?: string
          gists_url?: string
          gravatar_id?: string
          html_url?: string
          id?: number
          login?: string
          node_id?: string
          organizations_url?: string
          received_events_url?: string
          repos_url?: string
          site_admin?: boolean
          starred_url?: string
          subscriptions_url?: string
          type?: string
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      enum_page_types: 'INDEX' | 'BLOG' | 'PROJECT' | 'ROUTE' | 'PATH' | 'POST'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
