import { describe, it, expect } from 'vitest'
import { computeScore, getScoreExplanation } from './scoring.service'

describe('scoring.service', () => {
  it('computes score as (matched / target) * 100 rounded', () => {
    expect(computeScore(['A', 'B'], ['A', 'B', 'C'])).toBe(67)
    expect(computeScore(['A', 'B', 'C'], ['A', 'B', 'C'])).toBe(100)
    expect(computeScore([], ['A', 'B', 'C'])).toBe(0)
  })

  it('returns 0 when target keywords are empty', () => {
    expect(computeScore(['A'], [])).toBe(0)
  })

  it('getScoreExplanation returns human-readable explanation', () => {
    const explanation = getScoreExplanation(['A', 'B'], ['A', 'B', 'C'])
    expect(explanation).toContain('matched keywords 2')
    expect(explanation).toContain('target keywords 3')
    expect(explanation).toContain('67')
  })

  it('getScoreExplanation for zero target mentions no target keywords', () => {
    const explanation = getScoreExplanation([], [])
    expect(explanation).toContain('no target keywords')
  })
})
