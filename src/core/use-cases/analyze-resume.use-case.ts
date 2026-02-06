// Analyze Resume Use Case - evaluate resume text against target (job description or role + keywords)

import type { ResumeAnalysis } from '../entities/resume-analysis.entity'
import { extractFromText } from '../services/keyword-extractor.service'
import { normalizeKeywords } from '../services/keyword-normalizer'
import { computeScore, getScoreExplanation } from '../services/scoring.service'
import { ValidationError } from '../errors'

export interface AnalyzeResumeInput {
  resumeText: string
  jobDescription?: string
  role?: string
  keywords?: string[]
}

/**
 * Analyze resume against target. Option A: jobDescription. Option B: role + keywords.
 * Returns ranked keywords, matched, missing, confidence notes, deterministic score, readable summary.
 */
export function analyzeResume(input: AnalyzeResumeInput): ResumeAnalysis {
  const { resumeText, jobDescription, role, keywords } = input

  if (!resumeText || typeof resumeText !== 'string') {
    throw new ValidationError('resumeText is required and must be a non-empty string')
  }

  // Target: either job description (extract keywords) or role + keyword list
  let targetKeywords: string[]
  if (jobDescription && jobDescription.trim().length > 0) {
    targetKeywords = extractFromText(jobDescription)
    if (keywords?.length) {
      const fromList = normalizeKeywords(keywords)
      targetKeywords = [...new Set([...targetKeywords, ...fromList])]
    }
  } else if (keywords && Array.isArray(keywords) && keywords.length > 0) {
    targetKeywords = normalizeKeywords(keywords)
  } else {
    throw new ValidationError('Either jobDescription or keywords must be provided')
  }

  const resumeKeywords = extractFromText(resumeText)
  const resumeSet = new Set(resumeKeywords)
  const targetSet = new Set(targetKeywords)

  const matchedKeywords = targetKeywords.filter((k) => resumeSet.has(k))
  const missingKeywords = targetKeywords.filter((k) => !resumeSet.has(k))

  const topKeywords = resumeKeywords

  const overallScore = computeScore(matchedKeywords, targetKeywords)
  const scoreExplanation = getScoreExplanation(matchedKeywords, targetKeywords)

  const confidenceNotes: string[] = []
  if (matchedKeywords.length === targetKeywords.length && targetKeywords.length > 0) {
    confidenceNotes.push('Strong overlap with target keywords.')
  } else if (matchedKeywords.length > 0) {
    confidenceNotes.push(
      `Matched ${matchedKeywords.length} of ${targetKeywords.length} target keywords.`
    )
  }
  if (missingKeywords.length > 0) {
    confidenceNotes.push(`Missing ${missingKeywords.length} target keyword(s); consider highlighting relevant experience.`)
  }
  if (targetKeywords.length === 0) {
    confidenceNotes.push('No target keywords to compare against.')
  }

  const readableSummary = [
    scoreExplanation,
    `Top extracted keywords: ${topKeywords.length > 0 ? topKeywords.join(', ') : 'none'}.`,
    `Matched: ${matchedKeywords.length > 0 ? matchedKeywords.join(', ') : 'none'}.`,
    `Missing: ${missingKeywords.length > 0 ? missingKeywords.join(', ') : 'none'}.`,
  ].join(' ')

  return {
    topKeywords,
    matchedKeywords,
    missingKeywords,
    confidenceNotes,
    overallScore,
    readableSummary,
  }
}
