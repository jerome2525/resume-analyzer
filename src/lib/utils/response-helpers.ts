// API Response Helper Functions

import { NextResponse } from 'next/server'
import type { ApiResponse } from '@/types/api'

/**
 * Create a success response
 * @param data - Response data
 * @param message - Optional success message
 * @param meta - Optional metadata (pagination, etc.)
 * @returns NextResponse with success data
 */
export function successResponse<T>(
  data: T,
  message?: string,
  meta?: any,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      meta,
    },
    { status }
  )
}

/**
 * Create an error response
 * @param error - Error message
 * @param statusCode - HTTP status code
 * @returns NextResponse with error message
 */
export function errorResponse(
  error: string,
  statusCode: number = 500
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status: statusCode }
  )
}

