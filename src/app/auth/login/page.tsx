import Link from 'next/link'
import LoginForm from '@/components/LoginForm'

export const metadata = {
  title: 'Login | Midwest Underground',
  description: 'Sign in to access your HDD operations dashboard'
}

export default function LoginPage() {
  return (
    <>
      {/* Login Hero */}
      <section className="section" style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)'
      }}>
        <div className="container">
          <div style={{
            maxWidth: '480px',
            margin: '0 auto',
            backgroundColor: 'var(--bg-card)',
            padding: 'var(--space-2xl)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <h1 style={{
              fontSize: 'var(--text-3xl)',
              marginBottom: 'var(--space-md)',
              textAlign: 'center',
              color: 'var(--color-primary)'
            }}>
              Sign In
            </h1>
            <p style={{
              textAlign: 'center',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-2xl)'
            }}>
              Access your HDD operations dashboard
            </p>

            <LoginForm />

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-md)',
              margin: 'var(--space-xl) 0',
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-sm)'
            }}>
              <div style={{flex: 1, height: '1px', backgroundColor: 'var(--bg-secondary)'}} />
              <span>or</span>
              <div style={{flex: 1, height: '1px', backgroundColor: 'var(--bg-secondary)'}} />
            </div>

            {/* Additional Actions */}
            <div style={{textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>
              <p>
                Don't have an account?{' '}
                <Link href="/auth/register" style={{color: 'var(--color-primary)', fontWeight: 600}}>
                  Contact your administrator
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <div style={{
              marginTop: 'var(--space-xl)',
              padding: 'var(--space-md)',
              backgroundColor: 'var(--bg-accent)',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--color-secondary)'
            }}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0, marginBottom: 'var(--space-xs)'}}>
                <strong style={{color: 'var(--color-primary)'}}>Demo Credentials:</strong>
              </p>
              <p style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0, fontFamily: 'monospace'}}>
                Admin: jsmith@midwestunderground.com / admin123<br/>
                Operator: mjohnson@midwestunderground.com / operator123<br/>
                Client: tanderson@willmarmu.gov / client123
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div style={{textAlign: 'center', marginTop: 'var(--space-xl)'}}>
            <Link href="/" className="btn btn-outline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
