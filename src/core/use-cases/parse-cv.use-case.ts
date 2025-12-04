// Parse CV Use Case - Business Logic

import type { ParsedCV } from '../entities/parsed-cv.entity'
import type { IPDFParserService } from '../repositories/pdf-parser.interface'
import type { IAIService } from '../repositories/ai-service.interface'
import { ValidationError } from '../errors'

/**
 * Parse CV Use Case
 * Orchestrates PDF text extraction and AI-powered parsing
 */
export class ParseCVUseCase {
  constructor(
    private pdfParserService: IPDFParserService,
    private aiService: IAIService
  ) {}

  /**
   * Execute the CV parsing workflow
   * @param pdfBuffer - PDF file buffer
   * @returns Structured CV data
   * @throws {ValidationError} If PDF buffer is invalid
   * @throws {PDFParsingError} If PDF parsing fails
   * @throws {AIServiceError} If AI processing fails
   */
  async execute(pdfBuffer: Buffer): Promise<ParsedCV> {
    // Validate input
    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new ValidationError('PDF buffer is empty or invalid')
    }

    // Step 1: Extract text from PDF
    const extractedText = await this.pdfParserService.extractText(pdfBuffer)

    // Validate extracted text
    if (!extractedText || extractedText.trim().length === 0) {
      throw new ValidationError('No text could be extracted from the PDF')
    }

    // Step 2: Parse CV with AI
    const parsedCV = await this.aiService.parseCV(extractedText)

    // Step 3: Return structured data
    return parsedCV
  }
}

