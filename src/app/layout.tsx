import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PDF CV Parser API',
  description: 'API for parsing PDF CVs with AI',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

