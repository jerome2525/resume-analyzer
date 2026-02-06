// ResumeAnalysis Entity - Domain Model for analyzer output

export interface ResumeAnalysis {
  topKeywords: string[]
  matchedKeywords: string[]
  missingKeywords: string[]
  confidenceNotes: string[]
  overallScore: number
  readableSummary: string
}
