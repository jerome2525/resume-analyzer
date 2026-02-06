// Application Configuration

import { z } from 'zod'

const configSchema = z.object({
  app: z.object({
    env: z.enum(['development', 'production', 'test']).default('development'),
    url: z.string().url('Invalid app URL'),
  }),
})

function loadConfig() {
  const config = {
    app: {
      env: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
      url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    },
  }

  try {
    return configSchema.parse(config)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      throw new Error(`Configuration validation failed:\n${issues.join('\n')}`)
    }
    throw error
  }
}

export const config = loadConfig()

