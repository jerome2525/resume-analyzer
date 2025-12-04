# PDF CV Parser API

A production-ready **Next.js 15 API** for parsing PDF CVs and extracting structured information using **OpenAI GPT-4**. Built with **Clean Architecture** principles, **TypeScript**, and comprehensive **Swagger/OpenAPI** documentation.

## 🎯 Overview

This API accepts PDF CV/resume files, extracts text content, and uses OpenAI's GPT-4 model to intelligently parse and structure the information into a standardized JSON format containing:

- **Professional Summary** - A 2-3 sentence overview of the candidate
- **Skills** - Array of technical and professional competencies
- **Experience Years** - Total years of professional work experience

## ✨ Features

- ✅ **PDF Processing** - Extract text from PDF CVs using `pdf-parse`
- ✅ **AI-Powered Parsing** - Utilize OpenAI GPT-4 for intelligent data extraction
- ✅ **Clean Architecture** - Separation of concerns with Domain, Infrastructure, and Presentation layers
- ✅ **Swagger Documentation** - Interactive API documentation at `/api-docs`
- ✅ **Type Safe** - Full TypeScript with strict mode enabled
- ✅ **Production Ready** - Error handling, validation, and security headers
- ✅ **No Authentication Required** - Public API for easy testing

## 📋 Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **OpenAI API key** (configured in code - no env setup needed)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The API will be available at **http://localhost:3000**

### 3. Test the API

**Option A: Using Swagger UI (Recommended)**
1. Open http://localhost:3000/api-docs
2. Find the `POST /api/cv/parse` endpoint
3. Click "Try it out"
4. Upload a PDF CV file
5. Click "Execute"
6. View the structured JSON response!

**Option B: Using cURL**
```bash
curl -X POST 'http://localhost:3000/api/cv/parse' \
  -F 'file=@path/to/your-cv.pdf'
```

## 📚 API Documentation

### Interactive Documentation

Visit **http://localhost:3000/api-docs** for interactive Swagger UI documentation where you can test all endpoints in your browser.

### API Endpoint

#### Parse PDF CV

**POST** `/api/cv/parse`

Upload and parse a PDF CV to extract structured information.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` (PDF file, max 10MB)

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": "Experienced software engineer with 5+ years...",
    "skills": ["JavaScript", "React", "Node.js", "Python", "AWS"],
    "experience_years": 5
  },
  "message": "CV parsed successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message description"
}
```

## 🏗️ Architecture

This project follows **Clean Architecture** principles for maintainability and scalability.

### Project Structure

```
pdf-scanner/
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── api/                   # API Routes
│   │   │   ├── cv/parse/         # CV parser endpoint
│   │   │   └── swagger/          # OpenAPI spec endpoint
│   │   ├── api-docs/             # Swagger UI page
│   │   ├── page.tsx              # Home page
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   │
│   ├── core/                      # Domain Layer (Business Logic)
│   │   ├── entities/             # Domain models
│   │   │   └── parsed-cv.entity.ts
│   │   ├── use-cases/            # Business logic
│   │   │   └── parse-cv.use-case.ts
│   │   ├── repositories/         # Repository interfaces
│   │   │   ├── pdf-parser.interface.ts
│   │   │   └── ai-service.interface.ts
│   │   └── errors/               # Custom error classes
│   │       └── index.ts
│   │
│   ├── infrastructure/            # External Services Layer
│   │   ├── pdf/                  # PDF parsing implementation
│   │   │   └── pdf-parser.service.ts
│   │   ├── ai/                   # OpenAI integration
│   │   │   └── openai.service.ts
│   │   └── auth/                 # JWT service (optional)
│   │       └── jwt.service.ts
│   │
│   ├── lib/                       # Shared Utilities
│   │   ├── swagger/              # Swagger/OpenAPI configuration
│   │   │   └── config.ts
│   │   ├── validators/           # Zod validation schemas
│   │   │   └── cv.validators.ts
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

**Example: Parse CV Use Case**
```typescript
// src/core/use-cases/parse-cv.use-case.ts
export class ParseCVUseCase {
  constructor(
    private pdfParserService: IPDFParserService,
    private aiService: IAIService
  ) {}

  async execute(pdfBuffer: Buffer): Promise<ParsedCV> {
    // 1. Extract text from PDF
    const text = await this.pdfParserService.extractText(pdfBuffer)
    
    // 2. Parse with AI
    const parsed = await this.aiService.parseCV(text)
    
    return parsed
  }
}
```

#### 2. **Infrastructure Layer** (`/infrastructure`)
External service implementations.

- **PDF Parser**: `pdf-parse` library integration
- **AI Service**: OpenAI API integration
- **Auth Service**: JWT token management

**Example: OpenAI Service**
```typescript
// src/infrastructure/ai/openai.service.ts
export class OpenAIService implements IAIService {
  async parseCV(text: string): Promise<ParsedCV> {
    const completion = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    })
    
    return JSON.parse(completion.choices[0].message.content)
  }
}
```

#### 3. **Presentation Layer** (`/app`)
API routes and UI components.

- **API Routes**: HTTP endpoints using Next.js App Router
- **Swagger UI**: Interactive API documentation
- **Middleware**: Request/response processing

#### 4. **Shared Layer** (`/lib`, `/types`, `/config`)
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

The API uses environment variables for configuration. Create a `.env.local` file in the root directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# JWT Configuration (optional - for future auth features)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
JWT_EXPIRES_IN=1h

# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note**: For testing convenience during development, you can find a pre-configured `.env.local` file in the project. For production deployment, always use proper environment variable management.

### Application Settings

Configure application settings in `next.config.ts`:

```typescript
const nextConfig = {
  reactStrictMode: false, // Disabled for Swagger UI compatibility
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Max file upload size
    },
  }
}
```

## 📝 File Requirements

**Supported Format:**
- PDF files only (`.pdf` extension)

**File Size Limit:**
- Maximum 10MB per file

**Content Requirements:**
- Must contain actual text (not scanned images)
- Should be a CV/resume with professional information

## 🎨 Tech Stack

### Core Technologies
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.6 (strict mode)
- **Runtime**: Node.js 18+

### AI & Processing
- **AI Provider**: OpenAI GPT-4o-mini
- **PDF Processing**: pdf-parse 1.1.1

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

### Manual Testing

**Test with Sample CV:**
```bash
# Using curl
curl -X POST 'http://localhost:3000/api/cv/parse' \
  -F 'file=@sample-cv.pdf' \
  | json_pp
```

**Test with Swagger UI:**
1. Navigate to http://localhost:3000/api-docs
2. Use the "Try it out" feature
3. Upload a sample CV PDF
4. Verify the structured response

### Expected Output

For a typical CV, you should receive:

```json
{
  "success": true,
  "data": {
    "summary": "Dedicated software engineer with 7 years of expertise...",
    "skills": [
      "Python", "JavaScript", "React", "Node.js",
      "PostgreSQL", "AWS", "Docker", "Git"
    ],
    "experience_years": 7
  },
  "message": "CV parsed successfully"
}
```

## 🚨 Error Handling

The API implements centralized error handling with consistent response formats.

### Common Errors

**Invalid File Type (400)**
```json
{
  "success": false,
  "error": "Only PDF files are allowed"
}
```

**File Too Large (400)**
```json
{
  "success": false,
  "error": "File size must not exceed 10MB"
}
```

**PDF Parsing Error (400)**
```json
{
  "success": false,
  "error": "No text could be extracted from the PDF"
}
```

**AI Service Error (500)**
```json
{
  "success": false,
  "error": "Failed to parse CV with AI: [details]"
}
```

## 🔒 Security Features

- ✅ File type validation (PDF only)
- ✅ File size limits (10MB max)
- ✅ Input sanitization
- ✅ Security headers (X-Frame-Options, CSP, etc.)
- ✅ Error message sanitization
- ✅ No sensitive data exposure

**Security Headers Applied:**
```typescript
X-DNS-Prefetch-Control: on
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## ⚡ Performance Optimization

- **Code Splitting**: Dynamic imports for Swagger UI
- **Caching**: Webpack caching for faster builds
- **Compression**: Optimized API responses
- **Connection Pooling**: Efficient OpenAI API usage

## 📊 API Response Times

- **PDF Text Extraction**: ~100-500ms
- **OpenAI Processing**: ~2-5 seconds
- **Total Request Time**: ~2-6 seconds (depends on PDF size and OpenAI API)

## 🛠️ Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

## 🐛 Troubleshooting

### "No text could be extracted from the PDF"
- **Cause**: PDF is scanned image or password-protected
- **Solution**: Use a PDF with actual text content

### "File size must not exceed 10MB"
- **Cause**: PDF file is too large
- **Solution**: Compress the PDF or use a smaller file

### "Failed to parse CV with AI"
- **Cause**: OpenAI API error or invalid API key
- **Solution**: Check OpenAI API status and verify API key

### Port Already in Use
- **Cause**: Another process is using port 3000
- **Solution**: Kill the process or use a different port:
  ```bash
  PORT=3001 npm run dev
  ```

## 📖 Additional Documentation

- **Swagger UI**: http://localhost:3000/api-docs (Interactive API docs)
- **OpenAPI Spec**: http://localhost:3000/api/swagger (JSON specification)

## 🤝 Contributing

This is a demonstration project. For production use:

1. Add proper authentication
2. Implement rate limiting
3. Add database storage for parsed CVs
4. Implement user management
5. Add comprehensive test coverage
6. Set up CI/CD pipeline

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Next.js** - The React framework for production
- **OpenAI** - AI-powered CV parsing
- **pdf-parse** - PDF text extraction
- **Swagger/OpenAPI** - API documentation standards

## 📞 Support

For issues or questions:
- Check the interactive API docs at `/api-docs`
- Review error messages in the API responses
- Check server logs for detailed error information

---

**Built with ❤️ using Next.js 15, TypeScript, and OpenAI GPT-4**

**Ready to parse CVs!** Visit http://localhost:3000/api-docs to get started. 🚀
