import { describe, it, expect } from 'vitest'
import { analyzeResume } from './analyze-resume.use-case'

describe('analyze-resume use case', () => {
  it('returns correct shape: topKeywords, matched, missing, confidenceNotes, overallScore, readableSummary', () => {
    const result = analyzeResume({
      resumeText: 'I use Node.js and React.',
      keywords: ['Node.js', 'React', 'TypeScript'],
    })
    expect(result).toHaveProperty('topKeywords')
    expect(result).toHaveProperty('matchedKeywords')
    expect(result).toHaveProperty('missingKeywords')
    expect(result).toHaveProperty('confidenceNotes')
    expect(result).toHaveProperty('overallScore')
    expect(result).toHaveProperty('readableSummary')
    expect(Array.isArray(result.topKeywords)).toBe(true)
    expect(Array.isArray(result.matchedKeywords)).toBe(true)
    expect(Array.isArray(result.missingKeywords)).toBe(true)
    expect(Array.isArray(result.confidenceNotes)).toBe(true)
    expect(typeof result.overallScore).toBe('number')
    expect(typeof result.readableSummary).toBe('string')
  })

  it('matched = resume intersect target, missing = target minus resume', () => {
    const result = analyzeResume({
      resumeText: 'Skills: Node.js, React, PostgreSQL.',
      keywords: ['Node.js', 'React', 'TypeScript', 'Docker'],
    })
    expect(result.matchedKeywords.sort()).toEqual(['Node.js', 'React'])
    expect(result.missingKeywords.sort()).toEqual(['Docker', 'TypeScript'])
  })

  it('overallScore is deterministic from matched and target count', () => {
    const result = analyzeResume({
      resumeText: 'Node.js and React.',
      keywords: ['Node.js', 'React', 'TypeScript'],
    })
    expect(result.matchedKeywords).toHaveLength(2)
    expect(result.missingKeywords).toContain('TypeScript')
    expect(result.overallScore).toBe(67)
  })

  it('throws when resumeText is empty', () => {
    expect(() =>
      analyzeResume({ resumeText: '', keywords: ['React'] })
    ).toThrow('resumeText')
  })

  it('throws when neither jobDescription nor keywords provided', () => {
    expect(() =>
      analyzeResume({ resumeText: 'I am a developer.' })
    ).toThrow('jobDescription or keywords')
  })

  it('accepts jobDescription and extracts target keywords', () => {
    const result = analyzeResume({
      resumeText: 'I use React and Node.js.',
      jobDescription: 'We need React, Node.js, and TypeScript.',
    })
    expect(result.matchedKeywords).toEqual(
      expect.arrayContaining(['React', 'Node.js'])
    )
    expect(result.missingKeywords).toContain('TypeScript')
  })
})
