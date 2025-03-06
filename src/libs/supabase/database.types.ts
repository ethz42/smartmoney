export type Database = {
  public: {
    Tables: {
      test_items: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          amount: number
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          amount: number
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          amount?: number
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
