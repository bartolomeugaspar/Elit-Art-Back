import { createClient, SupabaseClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
)

export const connectDB = async (): Promise<void> => {
  try {
    // Test connection
    const { error } = await supabase.from('users').select('count()', { count: 'exact', head: true })
    
    if (error) {
      return
    }
    
  } catch (error) {
  }
}

export const disconnectDB = async (): Promise<void> => {
  try {
  } catch (error) {
    process.exit(1)
  }
}
