import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
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
              width={320}
              height={160}
              className="logo-image"
              priority
              style={{ width: 'auto', height: 'auto' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="site-nav" role="navigation" aria-label="Main Navigation">
            <ul className="nav-links">
              <li><Link href="/" className="active">Home</Link></li>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><Link href="/auth/login">Login</Link></li>
            </ul>
            <a href="tel:3203826636" className="nav-phone" aria-label="Call us at 320-382-6636">
              📞 (320) 382-6636
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-toggle" aria-label="Toggle mobile menu" aria-expanded="false">
            <span className="hamburger"></span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content">
        {/* Hero Section */}
        <section className="parallax-hero" role="banner">
          <div className="parallax-bg" style={{backgroundImage: "url('/images/BAckhoe digging.webp')"}}></div>
          <div className="parallax-overlay"></div>
          <div className="parallax-content">
            <h1>HDD Field Operations Management</h1>
            <p>Professional bore tracking, field reports, and project management for Midwest Underground of Minnesota</p>
            <div className="parallax-cta">
              <Link href="/dashboard" className="btn btn-primary btn-lg">Access Dashboard</Link>
              <Link href="/auth/login" className="btn btn-white btn-lg">Sign In</Link>
            </div>
          </div>
        </section>

        {/* Features Overview */}
        <section className="section gradient-bg-light">
          <div className="container">
            <div className="text-center" style={{marginBottom: 'var(--space-2xl)'}}>
              <h2 style={{color: 'var(--brand-slate-dark)'}}>HDD Management Features</h2>
              <p style={{fontSize: 'var(--text-lg)', color: 'var(--brand-slate-dark)', maxWidth: '700px', margin: '0 auto'}}>
                Professional tools for tracking drilling operations, managing field reports, and maintaining compliance across all HDD projects.
              </p>
            </div>

            <div className="services-grid">
              {/* Bore Logs */}
              <div className="service-card">
                <div className="service-icon">🎯</div>
                <h3>Bore Log Management</h3>
                <p>Track drilling operations with rod-by-rod logging, depth profiles, and real-time field measurements for every bore.</p>
                <Link href="/dashboard/bore-logs" className="service-link">
                  Manage Bore Logs <span>→</span>
                </Link>
              </div>

              {/* Field Reports */}
              <div className="service-card">
                <div className="service-icon">📝</div>
                <h3>Daily Field Reports</h3>
                <p>Document crew activities, production metrics, equipment usage, and weather conditions with full audit trails.</p>
                <Link href="/dashboard/field-reports" className="service-link">
                  Create Reports <span>→</span>
                </Link>
              </div>

              {/* Projects */}
              <div className="service-card">
                <div className="service-icon">🚧</div>
                <h3>Project Management</h3>
                <p>Manage HDD projects, timelines, budgets, and deliverables with comprehensive tracking and reporting.</p>
                <Link href="/dashboard/projects" className="service-link">
                  View Projects <span>→</span>
                </Link>
              </div>

              {/* 811 Compliance */}
              <div className="service-card">
                <div className="service-icon">⚠️</div>
                <h3>811 Compliance</h3>
                <p>Track utility locate tickets, expiration dates, and responses to ensure full compliance on every project.</p>
                <Link href="/dashboard/811-tickets" className="service-link">
                  Manage Tickets <span>→</span>
                </Link>
              </div>

              {/* Inspections */}
              <div className="service-card">
                <div className="service-icon">✅</div>
                <h3>Quality Inspections</h3>
                <p>Conduct QA/QC inspections, track corrective actions, and maintain detailed records of all quality checks.</p>
                <Link href="/dashboard/inspections" className="service-link">
                  View Inspections <span>→</span>
                </Link>
              </div>

              {/* Reports & Analytics */}
              <div className="service-card">
                <div className="service-icon">📊</div>
                <h3>Reports & Analytics</h3>
                <p>Generate comprehensive reports, analyze KPIs, and export data for project documentation and billing.</p>
                <Link href="/dashboard/reports" className="service-link">
                  View Reports <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Migration Status */}
        <section className="section">
          <div className="container">
            <div style={{maxWidth: '800px', margin: '0 auto'}}>
              <h2 className="text-center" style={{marginBottom: 'var(--space-lg)'}}>Next.js Migration Status</h2>

              <div style={{
                backgroundColor: 'var(--bg-accent)',
                border: '2px solid var(--color-secondary)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-xl)'
              }}>
                <div style={{marginBottom: 'var(--space-md)'}}>
                  <h3 style={{fontSize: 'var(--text-lg)', marginBottom: 'var(--space-sm)', color: 'var(--success)'}}>
                    ✅ Infrastructure Complete
                  </h3>
                  <ul style={{listStyle: 'none', padding: 0, marginLeft: 'var(--space-md)'}}>
                    <li style={{marginBottom: 'var(--space-xs)'}}>✅ Next.js 15.0.3 running successfully</li>
                    <li style={{marginBottom: 'var(--space-xs)'}}>✅ Prisma database with 17+ HDD operational models</li>
                    <li style={{marginBottom: 'var(--space-xs)'}}>✅ NextAuth authentication (OWNER, SUPER, CREW roles)</li>
                    <li style={{marginBottom: 'var(--space-xs)'}}>✅ Brand standards and CSS migrated</li>
                    <li style={{marginBottom: 'var(--space-xs)'}}>✅ Static assets preserved in /public</li>
                  </ul>
                </div>

                <div>
                  <h3 style={{fontSize: 'var(--text-lg)', marginBottom: 'var(--space-sm)', color: 'var(--color-secondary)'}}>
                    🔄 Next Steps
                  </h3>
                  <ul style={{listStyle: 'none', padding: 0, marginLeft: 'var(--space-md)'}}>
                    <li style={{marginBottom: 'var(--space-xs)'}}>⏳ Build authentication pages</li>
                    <li style={{marginBottom: 'var(--space-xs)'}}>⏳ Create HDD API routes</li>
                    <li style={{marginBottom: 'var(--space-xs)'}}>⏳ Build dashboard pages</li>
                    <li style={{marginBottom: 'var(--space-xs)'}}>⏳ Implement rod-by-rod logging</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
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
    </>
  )
}
