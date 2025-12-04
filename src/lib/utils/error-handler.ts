// Centralized Error Handler

import { NextResponse } from 'next/server'
import { AppError } from '@/core/errors'
import { ZodError } from 'zod'

/**
 * Handle API errors and convert to HTTP responses
 * @param error - Error object
 * @returns NextResponse with appropriate status and error message
 */
export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error)

  // Handle custom AppError
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: error.statusCode }
    )
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed',
        details: error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      },
      { status: 400 }
    )
  }

  // Handle generic errors
  const errorMessage = error instanceof Error ? error.message : 'Internal server error'

  return NextResponse.json(
    {
      success: false,
      error: errorMessage,
    },
    { status: 500 }
  )
}

