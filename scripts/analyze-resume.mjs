#!/usr/bin/env node
/**
 * CLI for Resume Analyzer API.
 * Usage:
 *   node scripts/analyze-resume.mjs --resume ./resume.txt --job ./job.txt
 *   node scripts/analyze-resume.mjs --resume ./resume.txt --role "Backend Engineer" --keywords "Node.js,React,PostgreSQL"
 * Requires: server running at http://localhost:3000 (npm run dev)
 */

import { readFileSync } from 'fs'

const BASE_URL = process.env.API_URL || 'http://localhost:3000'

function parseArgs() {
  const args = process.argv.slice(2)
  const out = { resume: null, job: null, role: null, keywords: null }
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--resume' && args[i + 1]) {
      out.resume = args[++i]
    } else if (args[i] === '--job' && args[i + 1]) {
      out.job = args[++i]
    } else if (args[i] === '--role' && args[i + 1]) {
      out.role = args[++i]
    } else if (args[i] === '--keywords' && args[i + 1]) {
      out.keywords = args[i + 1].split(',').map((k) => k.trim())
      i++
    }
  }
  return out
}

function readFile(path) {
  return readFileSync(path, 'utf-8')
}

async function main() {
  const { resume, job, role, keywords } = parseArgs()
  if (!resume) {
    console.error('Usage: node scripts/analyze-resume.mjs --resume <path> [--job <path> | --role "Title" --keywords "A,B,C"]')
    process.exit(1)
  }
  const resumeText = readFile(resume)
  let body = { resumeText }
  if (job) {
    body = { ...body, jobDescription: readFile(job) }
  } else if (role && keywords?.length) {
    body = { ...body, role, keywords }
  } else {
    console.error('Provide either --job <path> or --role and --keywords')
    process.exit(1)
  }

  const res = await fetch(`${BASE_URL}/api/resume/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) {
    console.error(data.error || 'Request failed')
    process.exit(1)
  }
  console.log(JSON.stringify(data.data, null, 2))
  if (data.data?.readableSummary) {
    console.log('\n--- Summary ---\n' + data.data.readableSummary)
  }
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
