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
      <div className="spinner" />
      <p style={{
        marginTop: 'var(--space-lg)',
        fontSize: 'var(--text-lg)',
        color: 'var(--text-secondary)'
      }}>
        Loading...
      </p>
    </div>
  )
}
