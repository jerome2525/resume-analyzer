// Resume Analyzer API Endpoint

import { NextRequest } from 'next/server'
import { analyzeResume } from '@/core/use-cases/analyze-resume.use-case'
import { handleApiError } from '@/lib/utils/error-handler'
import { successResponse } from '@/lib/utils/response-helpers'
import { analyzeResumeSchema } from '@/lib/validators/resume.validators'

/**
 * @swagger
 * /api/resume/analyze:
 *   post:
 *     summary: Analyze resume against target
 *     description: Evaluate plain text resume against a job description or role + keywords. Returns ranked keywords, matched/missing, confidence notes, and a deterministic score.
 *     tags:
 *       - Resume Analyzer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resumeText
 *             properties:
 *               resumeText:
 *                 type: string
 *                 description: Plain text resume content
 *                 example: "Jane Doe\nSoftware Engineer\n5 years. Skills: Node.js, React, TypeScript, PostgreSQL."
 *               jobDescription:
 *                 type: string
 *                 description: Full job description text (Option A)
 *                 example: "We need a full-stack developer. Requirements: Node.js, React, REST APIs, SQL."
 *               role:
 *                 type: string
 *                 description: Role title (Option B, use with keywords)
 *               keywords:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Target keywords (Option B)
 *                 example: ["Node.js", "PostgreSQL", "React"]
 *     responses:
 *       200:
 *         description: Analysis result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResumeAnalysis'
 *       400:
 *         description: Validation error (missing resumeText or target)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = analyzeResumeSchema.parse(body)
    const result = analyzeResume({
      resumeText: parsed.resumeText,
      jobDescription: parsed.jobDescription,
      role: parsed.role,
      keywords: parsed.keywords,
    })
    return successResponse(result, 'Analysis complete')
  } catch (error) {
    return handleApiError(error)
  }
}
