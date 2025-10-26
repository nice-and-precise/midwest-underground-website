import Link from 'next/link'
import ParallaxHero from '@/components/ParallaxHero'
import ParallaxSection from '@/components/ParallaxSection'

export default function HomePage() {
  return (
    <>
      {/* Hero Section with Parallax Effect */}
      <ParallaxHero />

      {/* Features Overview */}
      <ParallaxSection className="section gradient-bg-light" speed={0.15}>
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
      </ParallaxSection>

      {/* Call to Action */}
      <section className="section" style={{backgroundColor: 'var(--color-primary)', color: 'var(--white)'}}>
        <div className="container text-center">
          <h2 style={{marginBottom: 'var(--space-md)', color: 'var(--white)'}}>Ready to Get Started?</h2>
          <p style={{fontSize: 'var(--text-lg)', marginBottom: 'var(--space-xl)', maxWidth: '700px', margin: '0 auto var(--space-xl)'}}>
            Access your HDD operations dashboard to start tracking bore logs, managing field reports, and maintaining compliance.
          </p>
          <div style={{display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Link href="/dashboard" className="btn btn-secondary btn-lg">
              Go to Dashboard
            </Link>
            <Link href="/auth/login" className="btn" style={{backgroundColor: 'var(--bg-card)', color: 'var(--color-primary)'}}>
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
