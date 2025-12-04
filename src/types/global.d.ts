// Global TypeScript type definitions

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPENAI_API_KEY: string
      JWT_SECRET: string
      JWT_EXPIRES_IN?: string
      NODE_ENV: 'development' | 'production' | 'test'
      NEXT_PUBLIC_APP_URL: string
    }
  }
}

export {}

