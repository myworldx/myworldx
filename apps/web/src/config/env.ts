import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'
import packageFile from '@/../package.json' assert { type: 'json' }

export const { version: __version } = packageFile

export const __env = createEnv({
  server: {
    NODE_ENV: z.enum(['production', 'development']),
    DEPLOY_STAGE: z.enum(['production', 'development', 'test']),
    APP_ID: z.string(),
    APP_CLIENT_ID: z.string(),
    APP_WEBHOOK_SECRET: z.string(),
    APP_CLIENT_SECRET: z.string(),
    APP_PRIVATE_KEY: z.string(),
    NEXT_OTEL_VERBOSE: z.string(),
    APP_INSTALLATION_ID: z.string(),
    SUPABASE_URL: z.string(),
    SUPABASE_KEY: z.string(),
    SUPABASE_SCHEMA: z.string(),
  },

  client: {},

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DEPLOY_STAGE: process.env.DEPLOY_STAGE,
    APP_ID: process.env.APP_ID,
    APP_CLIENT_ID: process.env.APP_CLIENT_ID,
    APP_WEBHOOK_SECRET: process.env.APP_WEBHOOK_SECRET,
    APP_CLIENT_SECRET: process.env.APP_CLIENT_SECRET,
    APP_PRIVATE_KEY: process.env.APP_PRIVATE_KEY,
    NEXT_OTEL_VERBOSE: process.env.NEXT_OTEL_VERBOSE,
    APP_INSTALLATION_ID: process.env.APP_INSTALLATION_ID,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
    SUPABASE_SCHEMA: process.env.SUPABASE_SCHEMA,
  },
})
