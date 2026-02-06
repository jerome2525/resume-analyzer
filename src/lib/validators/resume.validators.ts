// Resume Analyzer request validation

import { z } from 'zod'

const analyzeResumeSchema = z
  .object({
    resumeText: z.string().min(1, 'resumeText is required'),
    jobDescription: z.string().optional(),
    role: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      const hasJob = data.jobDescription != null && data.jobDescription.trim().length > 0
      const hasKeywords = data.keywords != null && data.keywords.length > 0
      return hasJob || hasKeywords
    },
    { message: 'Either jobDescription or keywords must be provided' }
  )

export type AnalyzeResumeDTO = z.infer<typeof analyzeResumeSchema>
export { analyzeResumeSchema }
