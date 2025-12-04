// Swagger/OpenAPI Configuration

import type { OAS3Options } from 'swagger-jsdoc'

export const swaggerOptions: OAS3Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PDF CV Parser API',
      version: '1.0.0',
      description: 'API for parsing PDF CVs and extracting structured information using AI',
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
        ParsedCV: {
          type: 'object',
          properties: {
            summary: {
              type: 'string',
              description: 'Professional summary of the candidate',
              example: 'Experienced software engineer with 5 years in full-stack development',
            },
            skills: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'List of technical and professional skills',
              example: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
            },
            experience_years: {
              type: 'number',
              description: 'Total years of professional experience',
              example: 5,
            },
          },
        },
      },
    },
  },
  apis: ['./src/app/api/**/*.ts'],
}

