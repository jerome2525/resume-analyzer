// Swagger JSON Endpoint

import { NextResponse } from 'next/server'
import swaggerJsdoc from 'swagger-jsdoc'
import { swaggerOptions } from '@/lib/swagger/config'

/**
 * GET /api/swagger
 * Returns the OpenAPI specification as JSON
 */
export async function GET() {
  try {
    const swaggerSpec = swaggerJsdoc(swaggerOptions)
    return NextResponse.json(swaggerSpec)
  } catch (error) {
    console.error('Error generating Swagger spec:', error)
    return NextResponse.json(
      { error: 'Failed to generate API documentation' },
      { status: 500 }
    )
  }
}

