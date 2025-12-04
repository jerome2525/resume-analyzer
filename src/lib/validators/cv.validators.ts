// CV Validation Schemas

import { z } from 'zod'

/**
 * Parsed CV response schema
 */
export const parsedCVSchema = z.object({
  summary: z.string().min(1, 'Summary is required'),
  skills: z.array(z.string()).min(0, 'Skills must be an array'),
  experience_years: z.number().min(0, 'Experience years must be non-negative'),
})

/**
 * File upload validation schema
 */
export const fileUploadSchema = z.object({
  name: z.string(),
  size: z.number().max(10 * 1024 * 1024, 'File size must not exceed 10MB'),
  type: z.string().refine(
    (type) => type === 'application/pdf',
    'Only PDF files are allowed'
  ),
})

/**
 * Login request schema
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type ParsedCVDTO = z.infer<typeof parsedCVSchema>
export type FileUploadDTO = z.infer<typeof fileUploadSchema>
export type LoginDTO = z.infer<typeof loginSchema>

