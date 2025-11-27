'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NewEstimatePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    markupPercent: 0.15,
    taxPercent: 0,
    validUntil: '',
    notes: '',
    terms: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/estimates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : undefined
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create estimate')
      }

      const estimate = await response.json()
      router.push(`/dashboard/estimates/${estimate.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create estimate')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }))
  }

  return (
    <>
      {/* Page Header */}
      <section className="section" style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--brand-slate-dark) 100%)',
        color: 'var(--white)',
        paddingTop: 'var(--space-2xl)',
        paddingBottom: 'var(--space-2xl)'
      }}>
        <div className="container">
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <Link href="/dashboard/estimates" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-sm)' }}>
              &larr; Back to Estimates
            </Link>
          </div>
          <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-sm)' }}>
            Create New Estimate
          </h1>
          <p style={{ fontSize: 'var(--text-lg)', opacity: 0.9, marginBottom: 0 }}>
            Start a new HDD project estimate
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-xl)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #ef4444',
              color: '#dc2626',
              padding: 'var(--space-md)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--space-lg)'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: 'var(--space-xl)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              marginBottom: 'var(--space-lg)'
            }}>
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-lg)' }}>
                Basic Information
              </h2>

              <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
                <div>
                  <label htmlFor="name" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 500 }}>
                    Estimate Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Main Street HDD Bore"
                    style={{
                      width: '100%',
                      padding: 'var(--space-md)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--bg-secondary)',
                      fontSize: 'var(--text-base)'
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="description" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 500 }}>
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Project scope and details..."
                    style={{
                      width: '100%',
                      padding: 'var(--space-md)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--bg-secondary)',
                      fontSize: 'var(--text-base)',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="validUntil" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 500 }}>
                    Valid Until
                  </label>
                  <input
                    type="date"
                    id="validUntil"
                    name="validUntil"
                    value={formData.validUntil}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: 'var(--space-md)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--bg-secondary)',
                      fontSize: 'var(--text-base)'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: 'var(--space-xl)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              marginBottom: 'var(--space-lg)'
            }}>
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-lg)' }}>
                Customer Information
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="customerName" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 500 }}>
                    Customer Name
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Company or individual name"
                    style={{
                      width: '100%',
                      padding: 'var(--space-md)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--bg-secondary)',
                      fontSize: 'var(--text-base)'
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="customerEmail" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 500 }}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    placeholder="customer@example.com"
                    style={{
                      width: '100%',
                      padding: 'var(--space-md)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--bg-secondary)',
                      fontSize: 'var(--text-base)'
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="customerPhone" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 500 }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                    style={{
                      width: '100%',
                      padding: 'var(--space-md)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--bg-secondary)',
                      fontSize: 'var(--text-base)'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Pricing Settings */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: 'var(--space-xl)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              marginBottom: 'var(--space-lg)'
            }}>
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-lg)' }}>
                Pricing Settings
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                <div>
                  <label htmlFor="markupPercent" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 500 }}>
                    Markup Percentage
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    <input
                      type="number"
                      id="markupPercent"
                      name="markupPercent"
                      value={(formData.markupPercent * 100).toFixed(0)}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        markupPercent: (parseFloat(e.target.value) || 0) / 100
                      }))}
                      min="0"
                      max="100"
                      step="1"
                      style={{
                        width: '100%',
                        padding: 'var(--space-md)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--bg-secondary)',
                        fontSize: 'var(--text-base)'
                      }}
                    />
                    <span style={{ fontWeight: 500 }}>%</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="taxPercent" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 500 }}>
                    Tax Percentage
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    <input
                      type="number"
                      id="taxPercent"
                      name="taxPercent"
                      value={(formData.taxPercent * 100).toFixed(0)}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        taxPercent: (parseFloat(e.target.value) || 0) / 100
                      }))}
                      min="0"
                      max="100"
                      step="0.1"
                      style={{
                        width: '100%',
                        padding: 'var(--space-md)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--bg-secondary)',
                        fontSize: 'var(--text-base)'
                      }}
                    />
                    <span style={{ fontWeight: 500 }}>%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes & Terms */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: 'var(--space-xl)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              marginBottom: 'var(--space-lg)'
            }}>
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-lg)' }}>
                Notes & Terms
              </h2>

              <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
                <div>
                  <label htmlFor="notes" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 500 }}>
                    Internal Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Notes for internal use..."
                    style={{
                      width: '100%',
                      padding: 'var(--space-md)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--bg-secondary)',
                      fontSize: 'var(--text-base)',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="terms" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 500 }}>
                    Terms & Conditions
                  </label>
                  <textarea
                    id="terms"
                    name="terms"
                    value={formData.terms}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Standard terms and conditions..."
                    style={{
                      width: '100%',
                      padding: 'var(--space-md)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--bg-secondary)',
                      fontSize: 'var(--text-base)',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'flex-end' }}>
              <Link
                href="/dashboard/estimates"
                className="btn btn-secondary"
                style={{ padding: 'var(--space-md) var(--space-xl)' }}
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
                style={{ padding: 'var(--space-md) var(--space-xl)' }}
              >
                {isSubmitting ? 'Creating...' : 'Create Estimate'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
