import { createClient } from '@supabase/supabase-js'

// Default to empty values in development to prevent build errors
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key'

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)