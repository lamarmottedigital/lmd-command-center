import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LMD Command Center',
  description: 'Bureau virtuel personnel',
  manifest: '/manifest.json',
  themeColor: '#0f172a',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'LMD Command Center'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
