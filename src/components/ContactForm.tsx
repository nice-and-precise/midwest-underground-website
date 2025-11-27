'use client';

import { useState, FormEvent } from 'react';

interface FormState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  message: string;
}

export default function ContactForm() {
  const [formState, setFormState] = useState<FormState>({
    status: 'idle',
    message: '',
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState({ status: 'submitting', message: '' });

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || undefined,
      service: formData.get('service') as string || undefined,
      message: formData.get('message') as string,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setFormState({
            status: 'error',
            message: `Too many requests. Please try again in ${result.retryAfter} seconds.`,
          });
        } else {
          setFormState({
            status: 'error',
            message: result.message || 'Something went wrong. Please try again.',
          });
        }
        return;
      }

      setFormState({
        status: 'success',
        message: result.message || 'Thank you! We will be in touch soon.',
      });

      // Reset form
      e.currentTarget.reset();
    } catch {
      setFormState({
        status: 'error',
        message: 'Network error. Please check your connection and try again.',
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      {formState.status === 'success' && (
        <div style={{
          padding: 'var(--space-md)',
          backgroundColor: '#d4edda',
          borderRadius: 'var(--radius-md)',
          color: '#155724',
          marginBottom: 'var(--space-md)',
        }}>
          {formState.message}
        </div>
      )}

      {formState.status === 'error' && (
        <div style={{
          padding: 'var(--space-md)',
          backgroundColor: '#f8d7da',
          borderRadius: 'var(--radius-md)',
          color: '#721c24',
          marginBottom: 'var(--space-md)',
        }}>
          {formState.message}
        </div>
      )}

      <div>
        <label htmlFor="name" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600 }}>
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          disabled={formState.status === 'submitting'}
          style={{
            width: '100%',
            padding: 'var(--space-sm) var(--space-md)',
            border: '1px solid var(--gray-300)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-base)',
          }}
        />
      </div>

      <div>
        <label htmlFor="email" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600 }}>
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          disabled={formState.status === 'submitting'}
          style={{
            width: '100%',
            padding: 'var(--space-sm) var(--space-md)',
            border: '1px solid var(--gray-300)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-base)',
          }}
        />
      </div>

      <div>
        <label htmlFor="phone" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600 }}>
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          disabled={formState.status === 'submitting'}
          style={{
            width: '100%',
            padding: 'var(--space-sm) var(--space-md)',
            border: '1px solid var(--gray-300)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-base)',
          }}
        />
      </div>

      <div>
        <label htmlFor="service" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600 }}>
          Service Interested In
        </label>
        <select
          id="service"
          name="service"
          disabled={formState.status === 'submitting'}
          style={{
            width: '100%',
            padding: 'var(--space-sm) var(--space-md)',
            border: '1px solid var(--gray-300)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-base)',
            backgroundColor: 'var(--white)',
          }}
        >
          <option value="">Select a service...</option>
          <option value="hdd">Horizontal Directional Drilling</option>
          <option value="fiber">Fiber Optic Installation</option>
          <option value="utilities">Underground Utilities</option>
          <option value="telecom">Telecommunications</option>
          <option value="crossing">Road/Railway Crossings</option>
          <option value="emergency">Emergency Services</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600 }}>
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          disabled={formState.status === 'submitting'}
          style={{
            width: '100%',
            padding: 'var(--space-sm) var(--space-md)',
            border: '1px solid var(--gray-300)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-base)',
            resize: 'vertical',
          }}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-lg"
        disabled={formState.status === 'submitting'}
        style={{ marginTop: 'var(--space-sm)' }}
      >
        {formState.status === 'submitting' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
