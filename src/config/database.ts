import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export const connectDB = async (): Promise<void> => {
  try {
    // Test connection
    const { data, error } = await supabase.from('users').select('count()', { count: 'exact', head: true })
    
    if (error) {
      throw error
    }
    
    console.log('✅ Supabase connected successfully')
  } catch (error) {
    console.error('❌ Supabase connection error:', error)
    process.exit(1)
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
