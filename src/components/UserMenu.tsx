'use client'

import { signOut } from 'next-auth/react'
import { useState } from 'react'

interface UserMenuProps {
  user: {
    name?: string | null
    email: string
    role: string
  }
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/login' })
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-xs)',
          padding: 'var(--space-sm)',
          backgroundColor: 'var(--bg-secondary)',
          border: '2px solid var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          fontSize: 'var(--text-sm)',
          fontWeight: 500,
          color: 'var(--text-primary)',
          transition: 'all var(--transition-base)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-primary)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--bg-secondary)'
        }}
      >
        <span style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary)',
          color: 'var(--white)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: 'var(--text-sm)',
          flexShrink: 0
        }}>
          {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
        </span>
        <span style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '150px'
        }}>
          {user.name || user.email.split('@')[0]}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform var(--transition-base)'
          }}
        >
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + var(--space-xs))',
          right: 0,
          minWidth: '200px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-xl)',
          border: '2px solid var(--bg-secondary)',
          zIndex: 1000
        }}>
          <div style={{
            padding: 'var(--space-md)',
            borderBottom: '1px solid var(--bg-secondary)'
          }}>
            <p style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: 0,
              marginBottom: 'var(--space-xs)'
            }}>
              {user.name || 'User'}
            </p>
            <p style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)',
              margin: 0,
              marginBottom: 'var(--space-xs)'
            }}>
              {user.email}
            </p>
            <p style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-primary)',
              fontWeight: 600,
              margin: 0
            }}>
              Role: {user.role}
            </p>
          </div>

          <div style={{ padding: 'var(--space-xs)' }}>
            <button
              onClick={handleSignOut}
              style={{
                width: '100%',
                padding: 'var(--space-sm)',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-primary)',
                textAlign: 'left',
                transition: 'background-color var(--transition-base)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
