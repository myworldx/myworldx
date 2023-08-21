import { createClient } from '@supabase/supabase-js'
import { Database } from '@/@types/supabase/database'
import { __env, __version } from '@/config/env'

export const supabase = createClient<Database>(__env.SUPABASE_URL, __env.SUPABASE_KEY, {
  db: { schema: 'public' },
  global: { headers: { 'x-myworldx-version': __version } },
})
