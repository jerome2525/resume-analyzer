// OpenAI Service Implementation

import OpenAI from 'openai'
import type { IAIService } from '@/core/repositories/ai-service.interface'
import type { ParsedCV } from '@/core/entities/parsed-cv.entity'
import { AIServiceError } from '@/core/errors'

/**
 * OpenAI Service
 * Implements AI-powered CV parsing using OpenAI GPT models
 */
export class OpenAIService implements IAIService {
  private client: OpenAI

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new AIServiceError('OpenAI API key is required')
    }

    this.client = new OpenAI({
      apiKey,
    })
  }

  /**
   * Parse CV text and extract structured information
   * @param text - Raw CV text content
   * @returns Structured CV data
   * @throws {AIServiceError} If AI processing fails
   */
  async parseCV(text: string): Promise<ParsedCV> {
    try {
      const prompt = this._buildPrompt(text)

      const completion = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional CV/resume parser. Extract structured information from CVs accurately.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 1000,
      })

      const responseContent = completion.choices[0]?.message?.content

      if (!responseContent) {
        throw new AIServiceError('No response from OpenAI')
      }

      const parsedData = JSON.parse(responseContent)

      // Validate and structure the response
      const result: ParsedCV = {
        summary: parsedData.summary || 'No summary available',
        skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
        experience_years: typeof parsedData.experience_years === 'number' 
          ? parsedData.experience_years 
          : 0,
      }

      return result
    } catch (error) {
      if (error instanceof AIServiceError) {
        throw error
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new AIServiceError(`Failed to parse CV with AI: ${errorMessage}`)
    }
  }

  /**
   * Build the prompt for CV parsing
   * @param cvText - Raw CV text
   * @returns Formatted prompt
   */
  private _buildPrompt(cvText: string): string {
    return `Analyze the following CV/resume and extract structured information.

CV Content:
${cvText}

Please extract and return the following information in JSON format:

{
  "summary": "A concise 2-3 sentence professional summary of the candidate",
  "skills": ["Array of technical and professional skills"],
  "experience_years": <number of years of professional experience>
}

Guidelines:
- summary: Should be 2-3 sentences highlighting key qualifications and experience
- skills: Extract all relevant technical skills, tools, technologies, and professional competencies
- experience_years: Calculate total years of professional work experience (use 0 if not clear)

Return ONLY valid JSON, no additional text or explanation.`
  }
}

