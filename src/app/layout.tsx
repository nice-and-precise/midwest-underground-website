import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Midwest Underground of Minnesota | HDD & Underground Utilities',
  description: 'Professional Horizontal Directional Drilling (HDD) and underground utilities installation serving Central Minnesota since 1991.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
