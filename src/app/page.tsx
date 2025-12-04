import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">PDF CV Parser API</h1>
        <p className="text-gray-600 mb-8">
          Upload a PDF CV and get structured data extracted by AI
        </p>
        <div className="space-y-4">
          <Link
            href="/api-docs"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            View API Documentation
          </Link>
          <div className="text-sm text-gray-500 mt-4">
            <p>No authentication required - Start testing immediately!</p>
          </div>
        </div>
      </div>
    </main>
  )
}

