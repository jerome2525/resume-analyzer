# Quick Start Guide - PDF CV Parser API

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment Variables

Create a `.env.local` file in the root directory with your OpenAI API key:

```env
OPENAI_API_KEY=your-openai-api-key-here
```

> **Note**: You can copy `.env.example` as a starting point: `cp .env.example .env.local`

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

## 🎯 Parse Your First CV

### Using Swagger UI (Easiest Method)

1. Navigate to http://localhost:3000/api-docs
2. Find the **`POST /api/cv/parse`** endpoint
3. Click **"Try it out"**
4. Click **"Choose File"** and select a PDF CV
5. Click **"Execute"**
6. 🎉 See the parsed results!

### Using cURL

```bash
curl -X POST 'http://localhost:3000/api/cv/parse' \
  -F 'file=@path/to/your-cv.pdf'
```

### Using Postman

1. Create a new POST request
2. URL: `http://localhost:3000/api/cv/parse`
3. Body: `form-data`
4. Key: `file` (type: File)
5. Value: Select your PDF CV
6. Send!

---

## 📊 Example Response

```json
{
  "success": true,
  "data": {
    "summary": "Experienced software engineer with 7 years of expertise in developing web applications...",
    "skills": [
      "Python", 
      "JavaScript", 
      "React", 
      "Node.js", 
      "PostgreSQL", 
      "AWS", 
      "Docker"
    ],
    "experience_years": 7
  },
  "message": "CV parsed successfully"
}
```

---

## 📁 Project Structure

```
pdf-scanner/
├── src/
│   ├── app/              # Next.js routes
│   │   ├── api/cv/parse/ # CV parser endpoint
│   │   └── api-docs/     # Swagger UI
│   ├── core/             # Business logic
│   ├── infrastructure/   # External services (OpenAI, PDF)
│   └── lib/              # Utilities
├── package.json
└── README.md            # Full documentation
```

---

## 🎯 Key Features

- ✅ **No Authentication Required** - Public API for testing
- ✅ **PDF Upload** - Max 10MB
- ✅ **AI Parsing** - OpenAI GPT-4
- ✅ **Structured Output** - JSON format
- ✅ **Swagger Docs** - Interactive testing

---

## 🐛 Common Issues

### Port Already in Use
```bash
PORT=3001 npm run dev
```

### PDF Not Parsing
- Make sure PDF contains actual text (not scanned images)
- File must be under 10MB
- File must be a valid PDF

---

## 🛠️ Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run linter
npm run type-check # Check TypeScript types
```

---

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [TESTING.md](TESTING.md) for testing guidelines
- Explore the code following clean architecture principles
- Customize the OpenAI prompt in `src/infrastructure/ai/openai.service.ts`

---

## 🎉 You're All Set!

Your PDF CV Parser API is ready to use!

- **Swagger UI**: http://localhost:3000/api-docs
- **Home Page**: http://localhost:3000
- **API Endpoint**: http://localhost:3000/api/cv/parse

**Happy parsing! 🚀**
