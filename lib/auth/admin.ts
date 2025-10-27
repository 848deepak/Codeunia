import { createClient } from '@/lib/supabase/server'

export async function verifyAdminAuth() {
  try {
    const serverSupabase = await createClient()
    const { data: { user }, error: authError } = await serverSupabase.auth.getUser()
    
    if (authError || !user || user.user_metadata?.role !== 'admin') {
      return { isAdmin: false, user: null, error: 'Unauthorized: Admin access required' }
    }
    
    return { isAdmin: true, user, error: null }
  } catch {
    return { isAdmin: false, user: null, error: 'Authentication check failed' }
  }
}