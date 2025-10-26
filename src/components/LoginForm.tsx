'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { loginSchema } from '@/lib/validations'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    setIsLoading(true)

    // Validate with Zod
    const validation = loginSchema.safeParse({ email, password })
    if (!validation.success) {
      const errors: { email?: string; password?: string } = {}
      validation.error.errors.forEach((err) => {
        if (err.path[0] === 'email') errors.email = err.message
        if (err.path[0] === 'password') errors.password = err.message
      })
      setFieldErrors(errors)
      setIsLoading(false)
      return
    }

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError('Invalid email or password')
        setIsLoading(false)
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)'}}>
      {error && (
        <div style={{
          padding: 'var(--space-md)',
          backgroundColor: '#fee',
          border: '2px solid #fcc',
          borderRadius: 'var(--radius-md)',
          color: '#c00',
          fontSize: 'var(--text-sm)'
        }}>
          {error}
        </div>
      )}

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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          style={{
            width: '100%',
            padding: 'var(--space-sm)',
            border: `2px solid ${fieldErrors.email ? '#fcc' : 'var(--bg-secondary)'}`,
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-base)',
            transition: 'border-color var(--transition-base)'
          }}
          required
          disabled={isLoading}
        />
        {fieldErrors.email && (
          <p style={{color: '#c00', fontSize: 'var(--text-xs)', marginTop: 'var(--space-xs)'}}>
            {fieldErrors.email}
          </p>
        )}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          style={{
            width: '100%',
            padding: 'var(--space-sm)',
            border: `2px solid ${fieldErrors.password ? '#fcc' : 'var(--bg-secondary)'}`,
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-base)',
            transition: 'border-color var(--transition-base)'
          }}
          required
          disabled={isLoading}
        />
        {fieldErrors.password && (
          <p style={{color: '#c00', fontSize: 'var(--text-xs)', marginTop: 'var(--space-xs)'}}>
            {fieldErrors.password}
          </p>
        )}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 'var(--text-sm)'
      }}>
        <label style={{display: 'flex', alignItems: 'center', gap: 'var(--space-xs)'}}>
          <input type="checkbox" name="remember" disabled={isLoading} />
          <span>Remember me</span>
        </label>
        <Link href="/auth/forgot-password" style={{color: 'var(--color-primary)'}}>
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-lg"
        style={{width: '100%', opacity: isLoading ? 0.7 : 1}}
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}
