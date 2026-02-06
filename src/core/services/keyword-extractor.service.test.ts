import { describe, it, expect } from 'vitest'
import { extractFromText } from './keyword-extractor.service'

describe('keyword-extractor', () => {
  it('extracts allowlisted terms from text', () => {
    const text = 'I use Node.js and React daily. Also C++ and TypeScript.'
    const result = extractFromText(text)
    expect(result).toContain('Node.js')
    expect(result).toContain('React')
    expect(result).toContain('C++')
    expect(result).toContain('TypeScript')
    expect(result).not.toContain('random word')
  })

  it('does not extract SQL when only NoSQL appears (no false positive)', () => {
    const text = 'Experience with NoSQL databases.'
    const result = extractFromText(text)
    expect(result).toContain('NoSQL')
    expect(result).not.toContain('SQL')
  })

  it('extracts SQL when SQL appears as whole word', () => {
    const text = 'Strong SQL and PostgreSQL skills.'
    const result = extractFromText(text)
    expect(result).toContain('SQL')
    expect(result).toContain('PostgreSQL')
  })

  it('handles messy formatting without crashing', () => {
    const text = '  \n\n  Node.js   \t  React  \n  '
    const result = extractFromText(text)
    expect(result).toContain('Node.js')
    expect(result).toContain('React')
  })

  it('returns empty array for empty or whitespace-only text', () => {
    expect(extractFromText('')).toEqual([])
    expect(extractFromText('   \n\t  ')).toEqual([])
  })

  it('returns only allowlisted terms (no hallucination)', () => {
    const text = 'I know Node.js, React, and SuperDuperFramework and XYZ.'
    const result = extractFromText(text)
    expect(result).toContain('Node.js')
    expect(result).toContain('React')
    expect(result).not.toContain('SuperDuperFramework')
    expect(result).not.toContain('XYZ')
  })

  it('normalizes variants in resume text: nodejs, c++, .net to Node.js, C++, .NET', () => {
    const text = 'I use nodejs, c++, and .net. Also next.js and react.'
    const result = extractFromText(text)
    expect(result).toContain('Node.js')
    expect(result).toContain('C++')
    expect(result).toContain('.NET')
    expect(result).toContain('Next.js')
    expect(result).toContain('React')
    expect(result).toHaveLength(5)
  })

  it('normalizes synonym variants in resume: postgres, js to PostgreSQL, JavaScript', () => {
    const text = 'Used postgres, js, and docker. Some redis.'
    const result = extractFromText(text)
    expect(result).toContain('PostgreSQL')
    expect(result).toContain('JavaScript')
    expect(result).toContain('Docker')
    expect(result).toContain('Redis')
    expect(result).toHaveLength(4)
  })
})
