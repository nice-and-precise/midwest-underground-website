import type { Metadata } from 'next'
import { Oswald, Inter } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import DarkModeToggle from '@/components/DarkModeToggle'
import './globals.css'

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-heading',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Midwest Underground of Minnesota | HDD Field Operations',
  description: 'Professional HDD bore tracking, field reports, and project management for Midwest Underground of Minnesota Inc.',
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#343D46' }
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable} no-transition`}>
      <body>
        {/* Header */}
        <header className="site-header" role="banner">
          <div className="container header-container">
            {/* Logo */}
            <Link href="/" className="site-logo">
              <Image
                src="/images/logo_horizontal_official.png"
                alt="Midwest Underground of Minnesota"
                width={320}
                height={160}
                className="logo-image"
                priority
                sizes="(max-width: 768px) 120px, (max-width: 1024px) 160px, 320px"
                style={{ width: 'auto', height: 'auto' }}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="site-nav" role="navigation" aria-label="Main Navigation">
              <ul className="nav-links">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/dashboard">Dashboard</Link></li>
                <li><Link href="/auth/login">Login</Link></li>
              </ul>
              <a href="tel:3203826636" className="nav-phone" aria-label="Call us at 320-382-6636">
                📞 (320) 382-6636
              </a>

              {/* Dark Mode Toggle */}
              <DarkModeToggle />
            </nav>

            {/* Mobile Menu Toggle */}
            <button className="mobile-menu-toggle" aria-label="Toggle mobile menu" aria-expanded="false">
              <span className="hamburger"></span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main id="main-content">
          {children}
        </main>

        {/* Footer */}
        <footer className="site-footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-section">
                <h3>Midwest Underground of Minnesota</h3>
                <p>Professional HDD and underground utilities contractor serving central Minnesota since 1991.</p>
              </div>

              <div className="footer-section">
                <h3>Contact</h3>
                <p>4320 County Rd 8 SE<br/>Willmar, MN 56201</p>
                <p><a href="tel:3203826636">(320) 382-6636</a></p>
              </div>

              <div className="footer-section">
                <h3>Quick Links</h3>
                <ul className="footer-links">
                  <li><Link href="/dashboard">Dashboard</Link></li>
                  <li><Link href="/auth/login">Login</Link></li>
                  <li><a href="http://127.0.0.1:8000" target="_blank" rel="noopener">Static Site</a></li>
                </ul>
              </div>

              <div className="footer-section">
                <h3>Documentation</h3>
                <ul className="footer-links">
                  <li><a href="https://github.com/nice-and-precise/midwest-underground-website" target="_blank" rel="noopener">GitHub</a></li>
                  <li><Link href="/docs/migration">Migration Guide</Link></li>
                  <li><Link href="/docs/api">API Docs</Link></li>
                </ul>
              </div>
            </div>

            <div className="footer-bottom">
              <p>© {new Date().getFullYear()} Midwest Underground of Minnesota Inc. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
