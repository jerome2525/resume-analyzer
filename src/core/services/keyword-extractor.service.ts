// Keyword Extractor - deterministic extraction from text (allowlist + patterns, no AI)

import { normalizeKeyword } from './keyword-normalizer'

/**
 * Allowlist of known tech/skill terms (canonical form).
 * Sorted by length descending so "NoSQL" is matched before "SQL" (avoids false positives).
 * Keep small and explicit.
 */
const ALLOWLIST_CANONICAL = [
  'Next.js',
  'Node.js',
  'Vue.js',
  'TypeScript',
  'JavaScript',
  'PostgreSQL',
  'MongoDB',
  'Kubernetes',
  'GraphQL',
  '.NET',
  'NoSQL',
  'React',
  'Python',
  'Docker',
  'AWS',
  'REST',
  'Redis',
  'SQL',
  'C++',
  'C#',
  'Git',
  'API',
]

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildWordBoundaryRegex(canonical: string): RegExp {
  // Word boundary: \b matches between \w and \W. For "Node.js", the . is \W so \b works.
  const escaped = escapeRegex(canonical)
  return new RegExp(`\\b${escaped}\\b`, 'gi')
}

/**
 * Normalize input text for extraction: trim, collapse whitespace, no throw on odd chars.
 */
function normalizeText(text: string): string {
  if (typeof text !== 'string') return ''
  return text
    .trim()
    .replace(/\s+/g, ' ')
}

/**
 * Extract keywords from text using allowlist only. No hallucination; only terms that appear in text.
 * Returns canonical forms, order preserved by first occurrence (for ranking).
 */
export function extractFromText(text: string): string[] {
  const normalized = normalizeText(text)
  if (!normalized) return []

  const seen = new Set<string>()
  const result: string[] = []

  // Sort by length descending so "NoSQL" is matched before "SQL"
  const byLength = [...ALLOWLIST_CANONICAL].sort((a, b) => b.length - a.length)

  for (const canonical of byLength) {
    const re = buildWordBoundaryRegex(canonical)
    if (re.test(normalized) && !seen.has(canonical)) {
      seen.add(canonical)
      result.push(canonical)
    }
  }

  return result
}

/**
 * Get allowlist (for tests or debugging). Export if needed.
 */
export function getAllowlist(): readonly string[] {
  return ALLOWLIST_CANONICAL
}
