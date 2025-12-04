// CV Parser API Endpoint

import { NextRequest } from 'next/server'
import { ParseCVUseCase } from '@/core/use-cases/parse-cv.use-case'
import { PDFParserService } from '@/infrastructure/pdf/pdf-parser.service'
import { OpenAIService } from '@/infrastructure/ai/openai.service'
import { handleApiError } from '@/lib/utils/error-handler'
import { successResponse } from '@/lib/utils/response-helpers'
import { ValidationError } from '@/core/errors'
import { config } from '@/config'

/**
 * @swagger
 * /api/cv/parse:
 *   post:
 *     summary: Parse PDF CV
 *     description: Upload a PDF CV and extract structured information using AI
 *     tags:
 *       - CV Parser
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: PDF file to parse (max 10MB)
 *     responses:
 *       200:
 *         description: CV parsed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     summary:
 *                       type: string
 *                       example: "Experienced software engineer with 5 years in full-stack development"
 *                     skills:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["JavaScript", "React", "Node.js", "Python"]
 *                     experience_years:
 *                       type: number
 *                       example: 5
 *       400:
 *         description: Validation error or invalid file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Only PDF files are allowed"
 *       401:
 *         description: Unauthorized - JWT token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Authentication required"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Failed to parse PDF"
 */
export async function POST(request: NextRequest) {
  try {

    // Get form data
    const formData = await request.formData()
    const file = formData.get('file') as File

    // Validate file
    if (!file) {
      throw new ValidationError('No file uploaded')
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      throw new ValidationError('Only PDF files are allowed')
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      throw new ValidationError('File size must not exceed 10MB')
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Initialize services
    const pdfParserService = new PDFParserService()
    const openaiService = new OpenAIService(config.openai.apiKey)

    // Initialize use case
    const parseCVUseCase = new ParseCVUseCase(pdfParserService, openaiService)

    // Execute CV parsing
    const result = await parseCVUseCase.execute(buffer)

    // Return success response
    return successResponse(result, 'CV parsed successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

