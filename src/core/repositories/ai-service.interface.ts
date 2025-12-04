// AI Service Interface

import type { ParsedCV } from '../entities/parsed-cv.entity'

export interface IAIService {
  /**
   * Parse CV text and extract structured information
   * @param text - Raw CV text content
   * @returns Structured CV data
   * @throws {AIServiceError} If AI processing fails
   */
  parseCV(text: string): Promise<ParsedCV>
}

