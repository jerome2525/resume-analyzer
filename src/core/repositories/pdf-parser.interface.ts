// PDF Parser Service Interface

export interface IPDFParserService {
  /**
   * Extract text content from a PDF buffer
   * @param buffer - PDF file buffer
   * @returns Extracted text content
   * @throws {PDFParsingError} If PDF parsing fails
   */
  extractText(buffer: Buffer): Promise<string>
}

