// Application Configuration

import { z } from 'zod'

const configSchema = z.object({
  openai: z.object({
    apiKey: z.string().min(1, 'OpenAI API key is required'),
  }),
  jwt: z.object({
    secret: z.string().min(32, 'JWT secret must be at least 32 characters'),
    expiresIn: z.string().default('1h'),
  }),
  app: z.object({
    env: z.enum(['development', 'production', 'test']).default('development'),
    url: z.string().url('Invalid app URL'),
  }),
})

function loadConfig() {
  const config = {
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'pdf-scanner-super-secret-jwt-key-min-32-chars-long-2025',
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },
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

