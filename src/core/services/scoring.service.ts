// Scoring Service - deterministic, explainable score

/**
 * Compute overall score: (matched / target count) * 100, rounded.
 * If no target keywords, returns 0.
 */
export function computeScore(
  matchedKeywords: string[],
  targetKeywords: string[]
): number {
  if (targetKeywords.length === 0) return 0
  const ratio = matchedKeywords.length / targetKeywords.length
  return Math.round(ratio * 100)
}

/**
 * Human-readable explanation of how the score was computed.
 */
export function getScoreExplanation(
  matchedKeywords: string[],
  targetKeywords: string[]
): string {
  if (targetKeywords.length === 0) {
    return 'Score is 0 because there are no target keywords to match against.'
  }
  const score = computeScore(matchedKeywords, targetKeywords)
  return `Score = (matched keywords ${matchedKeywords.length} / target keywords ${targetKeywords.length}) × 100 = ${score}.`
}
