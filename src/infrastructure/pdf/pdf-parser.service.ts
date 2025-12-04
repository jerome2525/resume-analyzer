// PDF Parser Service Implementation

import PDFParser from 'pdf-parse'
import type { IPDFParserService } from '@/core/repositories/pdf-parser.interface'
import { PDFParsingError } from '@/core/errors'

/**
 * PDF Parser Service
 * Implements PDF text extraction using pdf-parse library
 */
export class PDFParserService implements IPDFParserService {
  /**
   * Extract text content from a PDF buffer
   * @param buffer - PDF file buffer
   * @returns Extracted text content
   * @throws {PDFParsingError} If PDF parsing fails
   */
  async extractText(buffer: Buffer): Promise<string> {
    try {
      const data = await PDFParser(buffer)
      
      if (!data.text || data.text.trim().length === 0) {
        throw new PDFParsingError('PDF appears to be empty or contains no extractable text')
      }

      return data.text
    } catch (error) {
      if (error instanceof PDFParsingError) {
        throw error
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new PDFParsingError(`Failed to parse PDF: ${errorMessage}`)
    }
  }
}

