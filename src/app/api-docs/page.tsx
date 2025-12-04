'use client'

import { useEffect, useState } from 'react'
import dynamicImport from 'next/dynamic'
import 'swagger-ui-react/swagger-ui.css'

// Force dynamic rendering - no static generation
export const dynamic = 'force-dynamic'

// Completely disable SSR for this page to prevent hydration errors
const ApiDocsContent = dynamicImport(() => import('./ApiDocsContent'), { 
  ssr: false
})

export default function ApiDocsPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Only render on client side to prevent ANY hydration issues
  if (!isClient) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" suppressHydrationWarning>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading API Documentation...</p>
        </div>
      </div>
    )
  }

  return <ApiDocsContent />
}

