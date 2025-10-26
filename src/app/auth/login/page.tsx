import Link from 'next/link'

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
            backgroundColor: 'var(--white)',
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

            {/* Login Form Placeholder */}
            <form style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)'}}>
              <div>
                <label htmlFor="email" style={{
                  display: 'block',
                  marginBottom: 'var(--space-xs)',
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your.email@example.com"
                  style={{
                    width: '100%',
                    padding: 'var(--space-sm)',
                    border: '2px solid var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-base)',
                    transition: 'border-color var(--transition-base)'
                  }}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" style={{
                  display: 'block',
                  marginBottom: 'var(--space-xs)',
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: 'var(--space-sm)',
                    border: '2px solid var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-base)',
                    transition: 'border-color var(--transition-base)'
                  }}
                  required
                />
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: 'var(--text-sm)'
              }}>
                <label style={{display: 'flex', alignItems: 'center', gap: 'var(--space-xs)'}}>
                  <input type="checkbox" name="remember" />
                  <span>Remember me</span>
                </label>
                <Link href="/auth/forgot-password" style={{color: 'var(--color-primary)'}}>
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{width: '100%'}}
              >
                Sign In
              </button>
            </form>

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

            {/* Info Box */}
            <div style={{
              marginTop: 'var(--space-xl)',
              padding: 'var(--space-md)',
              backgroundColor: 'var(--bg-accent)',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--color-secondary)'
            }}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0}}>
                <strong style={{color: 'var(--color-primary)'}}>Note:</strong> This is a placeholder login page.
                NextAuth integration is pending implementation.
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
