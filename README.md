# Resume Analyzer API

A lightweight **Next.js 15 API** that evaluates a plain text resume against a target role by extracting keywords and producing an actionable, human-readable assessment. Not an ATS clone—a fast signal generator. Built with **Clean Architecture**, **TypeScript**, and **Swagger/OpenAPI** documentation.

## Overview

- **Input:** Plain text resume plus target context (job description **or** role + keyword list).
- **Output:** JSON plus readable summary: ranked keywords, matched/missing keywords, confidence notes, and a **deterministic, explainable score**.

## How to run

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the server**
   ```bash
   npm run dev
   ```
   Server runs at **http://localhost:3000**.

## How to test (Swagger)

1. Open **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)** in your browser.
2. Find **POST /api/resume/analyze** (Resume Analyzer section).
3. Click **Try it out**.
4. In the **Request body** text box, paste JSON. You have one input: a single JSON text box (no file upload).
   - **Option A (resume + job description):**
     ```json
     {
       "resumeText": "Jane Doe\nSoftware Engineer\n5 years. Skills: Node.js, React, TypeScript, PostgreSQL.",
       "jobDescription": "We need a full-stack developer. Requirements: Node.js, React, REST APIs, SQL."
     }
     ```
   - **Option B (resume + role + keywords):** use `"role"` and `"keywords"` instead of `"jobDescription"`:
     ```json
     {
       "resumeText": "Jane Doe\nSoftware Engineer\nSkills: Node.js, React.",
       "role": "Backend Engineer",
       "keywords": ["Node.js", "PostgreSQL", "React"]
     }
     ```
5. Click **Execute**. Check the response body for `topKeywords`, `matchedKeywords`, `missingKeywords`, `overallScore`, and `readableSummary`.

## Example inputs and outputs

**Request (Option A):**
```json
{
  "resumeText": "Jane Doe\nSoftware Engineer\n5 years. Skills: Node.js, React, TypeScript, PostgreSQL.",
  "jobDescription": "We need a full-stack developer. Requirements: Node.js, React, REST APIs, SQL."
}
```

**Response (success):**
```json
{
  "success": true,
  "data": {
    "topKeywords": ["Node.js", "React", "TypeScript", "PostgreSQL"],
    "matchedKeywords": ["Node.js", "React"],
    "missingKeywords": ["REST", "SQL"],
    "confidenceNotes": ["Matched 2 of 4 target keywords.", "Missing 2 target keyword(s); consider highlighting relevant experience."],
    "overallScore": 50,
    "readableSummary": "Score = (matched keywords 2 / target keywords 4) × 100 = 50. Top extracted keywords: Node.js, React, TypeScript, PostgreSQL. Matched: Node.js, React. Missing: REST, SQL."
  },
  "message": "Analysis complete"
}
```

**Request (Option B):**
```json
{
  "resumeText": "Backend developer. Node.js, PostgreSQL, Redis.",
  "role": "Senior Backend Engineer",
  "keywords": ["Node.js", "PostgreSQL", "Redis", "AWS"]
}
```

**Response:** `matchedKeywords` will include Node.js, PostgreSQL, Redis; `missingKeywords` will include AWS; `overallScore` is deterministic from those counts.

## Scoring logic

- **Overall score** = (number of matched keywords / number of target keywords) × 100, rounded. If there are no target keywords, the score is 0.
- **Matched keywords** = keywords that appear in both the resume and the target (intersection).
- **Missing keywords** = target keywords that do not appear in the resume (target minus resume).

## Known limitations

- Keyword extraction is **allowlist- and pattern-based** (no AI); only terms in the allowlist are considered (e.g. Node.js, React, C++, .NET, SQL, NoSQL, etc.).
- The synonym map is small and explicit; add terms as needed.
- Non-English or niche skills may require extending the allowlist.
- Messy formatting is normalized (trim, collapse whitespace); the app does not crash on odd characters.

## API Documentation

### Interactive docs

Visit **http://localhost:3000/api-docs** for Swagger UI.

### Resume Analyzer endpoint

**POST** `/api/resume/analyze`

- **Content-Type:** `application/json`
- **Body:** `resumeText` (required), and either `jobDescription` (Option A) or `role` + `keywords` (Option B).

**Error response (e.g. 400):**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": []
}
```

## CLI

With the server running (`npm run dev`), you can call the API from the command line:

```bash
# Option A: resume + job description from files
node scripts/analyze-resume.mjs --resume ./resume.txt --job ./job.txt

# Option B: resume file + role and keywords
node scripts/analyze-resume.mjs --resume ./resume.txt --role "Backend Engineer" --keywords "Node.js,React,PostgreSQL"
```

Output is JSON plus the readable summary. Set `API_URL` to point to another host if needed.

## Unit tests

```bash
npm run test
```

Runs Vitest for keyword extractor, normalizer, scoring service, and analyze-resume use case.

## 🏗️ Architecture

This project follows **Clean Architecture** principles for maintainability and scalability.

### Project Structure

```
resume-analyzer/
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── api/                   # API Routes
│   │   │   ├── resume/analyze/   # Resume Analyzer endpoint
│   │   │   └── swagger/          # OpenAPI spec endpoint
│   │   ├── api-docs/             # Swagger UI page
│   │   ├── page.tsx              # Home page
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   │
│   ├── core/                      # Domain Layer (Business Logic)
│   │   ├── entities/             # Domain models
│   │   │   └── resume-analysis.entity.ts
│   │   ├── use-cases/            # Business logic
│   │   │   └── analyze-resume.use-case.ts
│   │   ├── services/             # Keyword extraction, normalization, scoring
│   │   │   ├── keyword-extractor.service.ts
│   │   │   ├── keyword-normalizer.ts
│   │   │   └── scoring.service.ts
│   │   └── errors/               # Custom error classes
│   │       └── index.ts
│   │
│   ├── lib/                       # Shared Utilities
│   │   ├── swagger/              # Swagger/OpenAPI configuration
│   │   │   └── config.ts
│   │   ├── validators/           # Zod validation schemas
│   │   │   └── resume.validators.ts
│   │   └── utils/                # Helper functions
│   │       ├── error-handler.ts
│   │       └── response-helpers.ts
│   │
│   ├── types/                     # TypeScript type definitions
│   │   ├── global.d.ts
│   │   └── api.ts
│   │
│   ├── config/                    # Configuration management
│   │   └── index.ts
│   │
│   └── middleware.ts              # Next.js middleware
│
├── public/                        # Static assets
├── .next/                         # Next.js build output
├── scripts/                       # CLI
│   └── analyze-resume.mjs        # Resume Analyzer CLI
├── node_modules/                  # Dependencies
├── package.json                   # Project dependencies
├── tsconfig.json                  # TypeScript configuration
├── next.config.ts                 # Next.js configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── postcss.config.mjs             # PostCSS configuration
└── README.md                      # This file
```

### Architecture Layers

#### 1. **Domain Layer** (`/core`)
Pure business logic with no external dependencies.

- **Entities**: Domain models and data structures
- **Use Cases**: Business logic implementation
- **Repository Interfaces**: Contracts for data access
- **Errors**: Custom error classes

**Example: Analyze Resume Use Case**
```typescript
// src/core/use-cases/analyze-resume.use-case.ts
export function analyzeResume(input: AnalyzeResumeInput): ResumeAnalysis {
  // Extract keywords from resume and target (allowlist-based, no AI)
  // Normalize, compute matched/missing, deterministic score, summary
  return { topKeywords, matchedKeywords, missingKeywords, confidenceNotes, overallScore, readableSummary }
}
```

#### 2. **Presentation Layer** (`/app`)
API routes and UI components.

- **API Routes**: HTTP endpoints using Next.js App Router
- **Swagger UI**: Interactive API documentation
- **Middleware**: Request/response processing

#### 3. **Shared Layer** (`/lib`, `/types`, `/config`)
Common utilities and configuration.

- **Validators**: Zod schemas for input validation
- **Utils**: Helper functions and error handlers
- **Config**: Environment and app configuration
- **Types**: Shared TypeScript definitions

### Design Patterns

- **Repository Pattern** - Abstract data access logic
- **Dependency Injection** - Decouple services for testability
- **Use Case Pattern** - Encapsulate business logic
- **Factory Pattern** - Service instantiation
- **Error Handling** - Centralized error management

## 🔧 Configuration

### Environment Variables

Optional. Create a `.env.local` file if needed:

```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

No API keys required for the Resume Analyzer (no AI).

## 🎨 Tech Stack

### Core
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.6 (strict mode)
- **Runtime**: Node.js 18+

### API & Documentation
- **API Documentation**: Swagger/OpenAPI 3.0
- **Validation**: Zod 3.23
- **Swagger UI**: swagger-ui-react 5.17

### Styling & UI
- **CSS Framework**: Tailwind CSS 3
- **PostCSS**: @tailwindcss/postcss

### Development
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript compiler

## 🧪 Testing

- **Manual**: Use Swagger at http://localhost:3000/api-docs (see "How to test (Swagger)" above).
- **Unit tests**: `npm run test` (Vitest).

## 🚨 Error Handling

Validation and server errors return `{ success: false, error: "..." }` with optional `details` for Zod errors. Security headers are applied (X-Frame-Options, etc.).

## 🛠️ Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run test         # Run unit tests
npm run lint        # Run ESLint
npm run type-check  # Run TypeScript compiler
```

## 🐛 Troubleshooting

### Port Already in Use
- **Cause**: Another process is using port 3000
- **Solution**: Kill the process or use a different port:
  ```bash
  PORT=3001 npm run dev
  ```

## 📖 Additional Documentation

- **Swagger UI**: http://localhost:3000/api-docs (Interactive API docs)
- **OpenAPI Spec**: http://localhost:3000/api/swagger (JSON specification)

## 🙏 Acknowledgments

- **Next.js** - React framework
- **Swagger/OpenAPI** - API documentation

---

**Resume Analyzer** – Visit http://localhost:3000/api-docs to get started.
