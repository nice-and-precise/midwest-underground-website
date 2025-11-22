'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      try {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })

        if (result?.error) {
          setError(result.error)
        } else if (result?.ok) {
          router.push(callbackUrl)
          router.refresh()
        }
      } catch (err) {
        setError('An unexpected error occurred. Please try again.')
        console.error('Login error:', err)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* Error Message */}
      {error && (
        <div style={{
          padding: 'var(--space-md)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius-md)',
          color: '#ef4444',
          fontSize: 'var(--text-sm)'
        }}>
          {error}
        </div>
      )}

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          style={{
            display: 'block',
            marginBottom: 'var(--space-xs)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: 'var(--text-primary)'
          }}
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          disabled={isPending}
          placeholder="you@company.com"
          style={{
            width: '100%',
            padding: 'var(--space-md)',
            fontSize: 'var(--text-base)',
            border: '1px solid var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--bg-secondary)'}
        />
      </div>

      {/* Password Field */}
      <div>
        <label
          htmlFor="password"
          style={{
            display: 'block',
            marginBottom: 'var(--space-xs)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: 'var(--text-primary)'
          }}
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          disabled={isPending}
          placeholder="••••••••"
          style={{
            width: '100%',
            padding: 'var(--space-md)',
            fontSize: 'var(--text-base)',
            border: '1px solid var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--bg-secondary)'}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="btn btn-primary"
        style={{
          width: '100%',
          padding: 'var(--space-md)',
          fontSize: 'var(--text-base)',
          fontWeight: 600,
          opacity: isPending ? 0.6 : 1,
          cursor: isPending ? 'not-allowed' : 'pointer'
        }}
      >
        {isPending ? 'Signing in...' : 'Sign In'}
      </button>

      {/* Remember Me / Forgot Password (Future) */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 'var(--text-sm)'
      }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', color: 'var(--text-secondary)' }}>
          <input type="checkbox" disabled style={{ cursor: 'not-allowed' }} />
          Remember me
        </label>
        <button
          type="button"
          disabled
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'not-allowed',
            textDecoration: 'underline'
          }}
        >
          Forgot password?
        </button>
      </div>
    </form>
  )
}
