'use client'

import { useEffect, useState } from 'react'
import { getPendingCount, processQueue } from '@/lib/offlineSync'

export default function OfflineSyncIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine)

    // Update online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check pending count periodically
    const checkPending = async () => {
      const count = await getPendingCount()
      setPendingCount(count)
    }

    checkPending()
    const interval = setInterval(checkPending, 10000) // Every 10 seconds

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [])

  const handleManualSync = async () => {
    if (!isOnline || isSyncing) return

    setIsSyncing(true)
    try {
      const result = await processQueue()
      console.log('Manual sync complete:', result)
      setPendingCount(0)
      setLastSyncTime(new Date())
    } catch (error) {
      console.error('Manual sync failed:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  if (isOnline && pendingCount === 0) {
    return (
      <div style={{
        position: 'fixed',
        top: 'var(--space-md)',
        right: 'var(--space-md)',
        padding: 'var(--space-sm) var(--space-md)',
        backgroundColor: '#dcfce7',
        border: '2px solid #22c55e',
        borderRadius: 'var(--radius-md)',
        color: '#166534',
        fontSize: 'var(--text-sm)',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-xs)',
        boxShadow: 'var(--shadow-md)',
        zIndex: 1000
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#22c55e'
        }} />
        Online & Synced
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      top: 'var(--space-md)',
      right: 'var(--space-md)',
      padding: 'var(--space-md)',
      backgroundColor: isOnline ? '#fef3c7' : '#fee2e2',
      border: `2px solid ${isOnline ? '#f59e0b' : '#ef4444'}`,
      borderRadius: 'var(--radius-lg)',
      color: isOnline ? '#92400e' : '#991b1b',
      fontSize: 'var(--text-sm)',
      boxShadow: 'var(--shadow-lg)',
      zIndex: 1000,
      minWidth: '250px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        marginBottom: 'var(--space-sm)'
      }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: isOnline ? '#f59e0b' : '#ef4444',
          animation: !isOnline ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
        }} />
        <span style={{ fontWeight: 700, fontSize: 'var(--text-base)' }}>
          {isOnline ? 'Pending Sync' : 'Offline Mode'}
        </span>
      </div>

      <p style={{
        margin: 0,
        marginBottom: 'var(--space-sm)',
        fontSize: 'var(--text-xs)',
        color: isOnline ? '#78350f' : '#7f1d1d'
      }}>
        {isOnline
          ? `${pendingCount} item${pendingCount !== 1 ? 's' : ''} waiting to sync`
          : 'Your changes are saved locally and will sync when back online'
        }
      </p>

      {isOnline && pendingCount > 0 && (
        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          style={{
            width: '100%',
            padding: 'var(--space-sm)',
            backgroundColor: isSyncing ? '#d97706' : '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: 'var(--text-sm)',
            cursor: isSyncing ? 'not-allowed' : 'pointer',
            opacity: isSyncing ? 0.7 : 1,
            transition: 'all var(--transition-base)'
          }}
        >
          {isSyncing ? 'Syncing...' : 'Sync Now'}
        </button>
      )}

      {lastSyncTime && (
        <p style={{
          margin: 0,
          marginTop: 'var(--space-sm)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-secondary)',
          textAlign: 'center'
        }}>
          Last sync: {lastSyncTime.toLocaleTimeString()}
        </p>
      )}
    </div>
  )
}
