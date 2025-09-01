require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function keepAlive() {
  try {
    // Update the last_ping timestamp
    const { data, error } = await supabase
      .from('keep_alive')
      .update({ last_ping: new Date().toISOString() })
      .eq('id', 1)
      .select()
    
    if (error) {
      // If update fails, try to insert a new row
      const { data: insertData, error: insertError } = await supabase
        .from('keep_alive')
        .insert([{ last_ping: new Date().toISOString() }])
        .select()
      
      if (insertError) {
        console.error('Error keeping project alive:', insertError.message)
      } else {
        console.log('Successfully pinged Supabase project (inserted new row)')
      }
    } else {
      console.log('Successfully pinged Supabase project (updated existing row)')
    }
  } catch (error) {
    console.error('Failed to ping Supabase:', error.message)
  }
}

keepAlive() 