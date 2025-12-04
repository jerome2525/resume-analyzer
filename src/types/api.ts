// API Response Types

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
  }
}

export interface JWTPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

