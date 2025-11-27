import Image from 'next/image'
import Link from 'next/link'
import { auth } from '@/auth'
import DarkModeToggle from '@/components/DarkModeToggle'
import MobileMenu from '@/components/MobileMenu'
import UserMenu from '@/components/UserMenu'

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <>
      {/* Header */}
      <header className="site-header" role="banner">
        <div className="container header-container">
          {/* Logo */}
          <Link href="/" className="site-logo">
            <Image
              src="/images/logo_horizontal_official.png"
              alt="Midwest Underground of Minnesota"
              width={240}
              height={120}
              className="logo-image"
              priority
              sizes="(max-width: 768px) 200px, (max-width: 1024px) 280px, 300px"
              style={{ width: 'auto', height: 'auto' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="site-nav" role="navigation" aria-label="Main Navigation">
            <ul className="nav-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/dashboard">Dashboard</Link></li>
              {!session && <li><Link href="/auth/login">Login</Link></li>}
            </ul>
            <a href="tel:3203826636" className="nav-phone" aria-label="Call us at 320-382-6636">
              📞 (320) 382-6636
            </a>

            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {/* User Menu (when logged in) */}
            {session?.user && (
              <UserMenu user={session.user} />
            )}
          </nav>

          {/* Mobile Menu */}
          <MobileMenu />
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
              </ul>
            </div>

            <div className="footer-section">
              <h3>Documentation</h3>
              <ul className="footer-links">
                <li><a href="https://github.com/nice-and-precise/midwest-underground-website" target="_blank" rel="noopener">GitHub</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Midwest Underground of Minnesota Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
