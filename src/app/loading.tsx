export default function Loading() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: 'var(--space-3xl)'
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        border: '4px solid var(--bg-secondary)',
        borderTop: '4px solid var(--color-primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{
        marginTop: 'var(--space-lg)',
        fontSize: 'var(--text-lg)',
        color: 'var(--text-secondary)'
      }}>
        Loading...
      </p>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
