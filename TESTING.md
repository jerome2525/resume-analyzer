# Testing Guide - PDF CV Parser API

## 🧪 How to Test the PDF CV Parser API

### Method 1: Using Swagger UI (Recommended)

This is the easiest way to test the API with a visual interface.

#### Step-by-Step:

1. **Start the server**:
   ```bash
   npm run dev
   ```

2. **Open Swagger UI**: 
   - Navigate to http://localhost:3000/api-docs
   - You'll see all available endpoints

3. **Test CV Parsing**:
   - Scroll to `POST /api/cv/parse`
   - Click "Try it out"
   - Click "Choose File" and select a PDF CV
   - Click "Execute"
   - 🎉 View the parsed result!

**No authentication required!** Just upload and parse.

---

### Method 2: Using cURL

Perfect for automation or command line testing.

```bash
curl -X POST 'http://localhost:3000/api/cv/parse' \
  -F 'file=@/path/to/your/cv.pdf' \
  -v
```

**Example with actual file:**
```bash
curl -X POST 'http://localhost:3000/api/cv/parse' \
  -F 'file=@JA-Python-JS-Automation-Engineer.pdf' \
  | json_pp
```

---

### Method 3: Using Postman

1. **Create New Request**:
   - Method: POST
   - URL: `http://localhost:3000/api/cv/parse`

2. **Configure Body**:
   - Select "form-data"
   - Key: `file` (change type to "File")
   - Value: Select your PDF CV

3. **Send Request**
   - Click "Send"
   - View the structured response

---

### Method 4: JavaScript Fetch API

```javascript
async function parseCV(file) {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await fetch('http://localhost:3000/api/cv/parse', {
    method: 'POST',
    body: formData
  })
  
  const data = await response.json()
  console.log('Parsed CV:', data)
  return data
}

// Usage
const fileInput = document.querySelector('input[type="file"]')
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0]
  if (file && file.type === 'application/pdf') {
    await parseCV(file)
  }
})
```

---

## 📄 Test CV Requirements

Your test PDF should:
- ✅ Be a valid PDF file (not corrupted)
- ✅ Contain actual text (not scanned images)
- ✅ Be under 10MB in size
- ✅ Include CV/resume information (experience, skills, etc.)

---

## ✅ Expected Response Format

**Success Response:**
```json
{
  "success": true,
  "data": {
    "summary": "Experienced software engineer with 5+ years in full-stack development, specializing in React and Node.js.",
    "skills": [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "MongoDB",
      "AWS",
      "Docker",
      "Git"
    ],
    "experience_years": 5
  },
  "message": "CV parsed successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## 🐛 Common Testing Issues

### 1. "Only PDF files are allowed"
**Problem**: Uploading non-PDF file  
**Solution**: Ensure file has `.pdf` extension and correct MIME type

### 2. "File size must not exceed 10MB"
**Problem**: PDF is too large  
**Solution**: Compress the PDF or use a smaller file

### 3. "No text could be extracted from the PDF"
**Problem**: PDF is scanned image or encrypted  
**Solution**: Use a PDF with actual text content, not images

### 4. "Failed to parse CV with AI"
**Problem**: OpenAI API error  
**Solution**: 
- Check server logs for details
- Verify OpenAI API key is valid
- Check your OpenAI account has available credits

---

## 🔍 Testing Checklist

- [ ] Server is running on port 3000
- [ ] Can access http://localhost:3000/api-docs
- [ ] Can upload a PDF file
- [ ] Receives structured JSON response
- [ ] Response includes: summary, skills, experience_years
- [ ] Error handling works (try invalid file, too large file, etc.)

---

## 📊 Sample Test Cases

### Test Case 1: Valid CV ✅
**Input**: Standard PDF CV with clear experience and skills  
**Expected**: 200 OK with structured data

### Test Case 2: Empty PDF ❌
**Input**: Empty or blank PDF  
**Expected**: 400 Bad Request - "No text could be extracted"

### Test Case 3: Invalid File Type ❌
**Input**: .docx or .txt file  
**Expected**: 400 Bad Request - "Only PDF files are allowed"

### Test Case 4: Large File ❌
**Input**: 15MB PDF file  
**Expected**: 400 Bad Request - "File size must not exceed 10MB"

### Test Case 5: Image PDF ❌
**Input**: Scanned PDF (images only)  
**Expected**: 400 Bad Request - "No text could be extracted"

---

## 🎯 Performance Testing

### Expected Response Times:
- **Small PDF (1-2 pages)**: 2-3 seconds
- **Medium PDF (3-5 pages)**: 3-5 seconds
- **Large PDF (6-10 pages)**: 5-8 seconds

**Breakdown:**
- PDF text extraction: ~100-500ms
- OpenAI processing: ~2-5 seconds
- API overhead: ~100-200ms

---

## 📝 Manual Testing Script

Create a test script to verify all functionality:

```bash
#!/bin/bash

echo "🧪 Testing PDF CV Parser API..."

# Test 1: Valid CV
echo "\n1. Testing with valid CV..."
curl -X POST http://localhost:3000/api/cv/parse \
  -F "file=@test-cv.pdf" \
  -w "\nHTTP Status: %{http_code}\n"

# Test 2: Invalid file type
echo "\n2. Testing with invalid file type..."
curl -X POST http://localhost:3000/api/cv/parse \
  -F "file=@test-document.txt" \
  -w "\nHTTP Status: %{http_code}\n"

# Test 3: Missing file
echo "\n3. Testing with no file..."
curl -X POST http://localhost:3000/api/cv/parse \
  -w "\nHTTP Status: %{http_code}\n"

echo "\n✅ Testing complete!"
```

Save as `test-api.sh`, make executable with `chmod +x test-api.sh`, then run `./test-api.sh`.

---

## 🎯 Success Criteria

Your API is working correctly if:
- ✅ Accepts PDF files up to 10MB
- ✅ Rejects non-PDF files with appropriate error
- ✅ Extracts text from PDF successfully
- ✅ Returns structured JSON with summary, skills, and experience
- ✅ Handles errors gracefully with clear messages
- ✅ Swagger UI loads and functions correctly
- ✅ Response times are within acceptable range (2-8 seconds)

---

## 🔧 Debugging Tips

### Check Server Logs
The terminal running `npm run dev` shows detailed logs:
```
POST /api/cv/parse 200 in 3421ms
```

### Check Swagger UI
Visit http://localhost:3000/api-docs and use the "Try it out" feature for interactive debugging.

### Inspect Response
Use `-v` flag with curl to see full request/response:
```bash
curl -v -X POST http://localhost:3000/api/cv/parse \
  -F "file=@test-cv.pdf"
```

### Check OpenAPI Spec
Visit http://localhost:3000/api/swagger to see the full API specification.

---

## 📚 Additional Resources

- **Full Documentation**: [README.md](README.md)
- **Quick Start**: [QUICKSTART.md](QUICKSTART.md)
- **Swagger UI**: http://localhost:3000/api-docs
- **OpenAPI Spec**: http://localhost:3000/api/swagger

---

## 🎉 Happy Testing!

Your PDF CV Parser API is ready for thorough testing. Start with Swagger UI for the best interactive experience!

**Questions or issues?** Check the logs and error messages - they're designed to be helpful! 🚀
