# Quick Start Guide - Resume Analyzer API

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment Variables (optional)

No API keys required. Create a `.env.local` only if you need JWT or custom app URL (see README).

### Step 3: Start the Server

```bash
npm run dev
```

The server will start at **http://localhost:3000**

### Step 4: Test the API

Open your browser and go to:
**http://localhost:3000/api-docs**

You'll see the Swagger UI with interactive API documentation!

---

## 🎯 Analyze Your First Resume

### Using Swagger UI (Easiest Method)

1. Navigate to http://localhost:3000/api-docs
2. Find **`POST /api/resume/analyze`**
3. Click **"Try it out"**
4. In the Request body, paste JSON with `resumeText` and `jobDescription` (or `role` + `keywords`)
5. Click **"Execute"**
6. See ranked keywords, matched/missing, score, and summary!

### Using cURL

```bash
curl -X POST 'http://localhost:3000/api/resume/analyze' \
  -H 'Content-Type: application/json' \
  -d '{"resumeText":"Your resume text...","jobDescription":"Job description..."}'
```

---

## 📊 Example Response

```json
{
  "success": true,
  "data": {
    "topKeywords": ["Node.js", "React", "TypeScript"],
    "matchedKeywords": ["Node.js", "React"],
    "missingKeywords": ["SQL"],
    "confidenceNotes": ["Matched 2 of 3 target keywords."],
    "overallScore": 67,
    "readableSummary": "Score = (matched keywords 2 / target keywords 3) × 100 = 67. ..."
  },
  "message": "Analysis complete"
}
```

---

## 🎯 Key Features

- ✅ **No API keys** - No OpenAI or external APIs
- ✅ **Deterministic scoring** - Allowlist-based keyword extraction
- ✅ **Swagger docs** - Interactive testing at /api-docs

---

## 🐛 Common Issues

### Port Already in Use
```bash
PORT=3001 npm run dev
```

---

## 🛠️ Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run test       # Run unit tests
npm run lint      # Run linter
npm run type-check # Check TypeScript types
```

---

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [TESTING.md](TESTING.md) for testing guidelines

---

## 🎉 You're All Set!

- **Swagger UI**: http://localhost:3000/api-docs
- **API Endpoint**: http://localhost:3000/api/resume/analyze
