import { createClient, SupabaseClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Missing Supabase environment variables. Using placeholder values.')
  console.warn('Please update your .env file with valid Supabase credentials.')
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
      console.warn('⚠️  Warning: Could not verify Supabase connection. Tables may not exist yet.')
      console.warn('Make sure to run the SQL schemas from SUPABASE_SETUP.md')
      return
    }
    
    console.log('✅ Supabase connected successfully')
  } catch (error) {
    console.warn('⚠️  Warning: Could not verify Supabase connection.')
    console.warn('Make sure to run the SQL schemas from SUPABASE_SETUP.md')
  }
}

export const disconnectDB = async (): Promise<void> => {
  try {
    console.log('✅ Supabase disconnected')
  } catch (error) {
    console.error('❌ Supabase disconnection error:', error)
    process.exit(1)
  }
}
