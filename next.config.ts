import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false, // Disabled to suppress warnings from swagger-ui-react library
  poweredByHeader: false,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  webpack: (config) => {
    // Handle canvas dependency for pdf-parse
    config.resolve.alias.canvas = false
    
    // Suppress warnings from third-party libraries
    config.ignoreWarnings = [
      { module: /node_modules\/swagger-ui-react/ },
    ]
    
    return config
  },
}

export default nextConfig

