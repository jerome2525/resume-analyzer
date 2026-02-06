// Keyword Extractor - deterministic extraction from text (allowlist + variants, no AI)

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

/**
 * Variant patterns for resume text: match common spellings (no dot, no space) and
 * special chars (C++, .NET) that word-boundary regex handles poorly. Map to canonical.
 * Order: longer / more specific first so "nodejs" is matched before "node" if we had it.
 */
const VARIANT_PATTERNS: { pattern: RegExp; canonical: string }[] = [
  { pattern: /\bnodejs\b/gi, canonical: 'Node.js' },
  { pattern: /\bnextjs\b/gi, canonical: 'Next.js' },
  { pattern: /\bpostgres\b/gi, canonical: 'PostgreSQL' },
  { pattern: /\bdotnet\b/gi, canonical: '.NET' },
  { pattern: /(?:^|\s)\.net(?:[\s,.)]|$)/gi, canonical: '.NET' },
  { pattern: /\bc\+\+(?:[\s,.]|$)/gi, canonical: 'C++' },
  { pattern: /\bc#(?:[\s,.]|$)/gi, canonical: 'C#' },
  { pattern: /\bpostgresql\b/gi, canonical: 'PostgreSQL' },
  { pattern: /\bmongodb\b/gi, canonical: 'MongoDB' },
  { pattern: /\bmongo\b/gi, canonical: 'MongoDB' },
  { pattern: /\btypescript\b/gi, canonical: 'TypeScript' },
  { pattern: /\bjavascript\b/gi, canonical: 'JavaScript' },
  { pattern: /\bjs\b/gi, canonical: 'JavaScript' },
  { pattern: /\bts\b/gi, canonical: 'TypeScript' },
  { pattern: /\bk8s\b/gi, canonical: 'Kubernetes' },
  { pattern: /\bvue\b/gi, canonical: 'Vue.js' },
  { pattern: /\breactjs\b/gi, canonical: 'React' },
]

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildWordBoundaryRegex(canonical: string): RegExp {
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
 * Extract keywords from text using variant patterns + allowlist. No hallucination.
 * Returns canonical forms. Variants (e.g. "nodejs", ".net", "c++") normalize to Node.js, .NET, C++.
 */
export function extractFromText(text: string): string[] {
  const normalized = normalizeText(text)
  if (!normalized) return []

  const seen = new Set<string>()
  const result: string[] = []

  // 1. Match variant patterns (nodejs, .net, c++, etc.) so resume spellings normalize
  for (const { pattern, canonical } of VARIANT_PATTERNS) {
    if (pattern.test(normalized) && !seen.has(canonical)) {
      seen.add(canonical)
      result.push(canonical)
    }
  }

  // 2. Match allowlist canonicals (word-boundary); skip if already added via variant
  const byLength = [...ALLOWLIST_CANONICAL].sort((a, b) => b.length - a.length)
  for (const canonical of byLength) {
    if (seen.has(canonical)) continue
    const re = buildWordBoundaryRegex(canonical)
    if (re.test(normalized)) {
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
