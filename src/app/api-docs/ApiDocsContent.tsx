'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { 
  ssr: false,
  loading: () => <div className="p-8 text-center">Loading Swagger UI...</div>
})

export default function ApiDocsContent() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent any server-side rendering issues
  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <SwaggerUI url="/api/swagger" />
    </div>
  )
}

