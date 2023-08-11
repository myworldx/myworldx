import { Database } from '@/@types/database/database'
import { env } from '@/config/env'
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_KEY)
