// Swagger/OpenAPI Configuration

import type { OAS3Options } from 'swagger-jsdoc'

export const swaggerOptions: OAS3Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Resume Analyzer API',
      version: '1.0.0',
      description: 'Evaluate plain text resume against a job description or role + keywords. Returns ranked keywords, matched/missing, confidence notes, and a deterministic score.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://your-production-url.com',
        description: 'Production server',
      },
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Error message',
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  path: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        ResumeAnalysis: {
          type: 'object',
          properties: {
            topKeywords: {
              type: 'array',
              items: { type: 'string' },
              description: 'Top extracted keywords from resume (ranked)',
            },
            matchedKeywords: {
              type: 'array',
              items: { type: 'string' },
              description: 'Keywords that appear in both resume and target',
            },
            missingKeywords: {
              type: 'array',
              items: { type: 'string' },
              description: 'Target keywords not found in resume',
            },
            confidenceNotes: {
              type: 'array',
              items: { type: 'string' },
              description: 'Human-readable confidence notes',
            },
            overallScore: {
              type: 'number',
              description: 'Deterministic score (0-100)',
            },
            readableSummary: {
              type: 'string',
              description: 'Actionable human-readable summary',
            },
          },
        },
      },
    },
  },
  apis: ['./src/app/api/**/*.ts'],
}

