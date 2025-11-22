import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="section" style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="container">
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '6rem',
            fontWeight: 800,
            color: 'var(--color-primary)',
            marginBottom: 'var(--space-md)',
            lineHeight: 1
          }}>
            404
          </h1>
          <h2 style={{
            fontSize: 'var(--text-3xl)',
            marginBottom: 'var(--space-md)',
            color: 'var(--text-primary)'
          }}>
            Page Not Found
          </h2>
          <p style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-2xl)'
          }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div style={{
            display: 'flex',
            gap: 'var(--space-md)',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link href="/" className="btn btn-primary btn-lg">
              ← Back to Home
            </Link>
            <Link href="/dashboard" className="btn btn-outline btn-lg">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
