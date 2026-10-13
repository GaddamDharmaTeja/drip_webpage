import { useState, type FormEvent } from 'react'
import { submitContact } from '../lib/api'

export function Contact() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const form = new FormData(e.currentTarget)
    try {
      await submitContact({
        name: String(form.get('name') ?? ''),
        email: String(form.get('email') ?? ''),
        message: String(form.get('message') ?? ''),
      })
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send message')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <h1 className="font-display text-4xl text-forest">Contact Us</h1>
      <p className="mt-1 text-stone-600">Quotes, installation booking, and bulk enquiries.</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-leaf/10 bg-soil p-8 text-stone-200">
          <h2 className="font-display text-2xl text-white">DripGrow HQ</h2>
          <dl className="mt-6 space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-leaf-light">Address</dt>
              <dd className="mt-1">12 Agri Tech Park, Nashik Road, Maharashtra 422101</dd>
            </div>
            <div>
              <dt className="font-semibold text-leaf-light">Email</dt>
              <dd className="mt-1">hello@dripgrow.example</dd>
            </div>
            <div>
              <dt className="font-semibold text-leaf-light">Phone / WhatsApp</dt>
              <dd className="mt-1">+91 98765 43210</dd>
            </div>
            <div>
              <dt className="font-semibold text-leaf-light">Hours</dt>
              <dd className="mt-1">Mon–Sat, 9:00–18:00 IST</dd>
            </div>
          </dl>
        </div>

        <form onSubmit={(e) => void onSubmit(e)} className="rounded-2xl border border-leaf/10 bg-white p-8">
          {sent ? (
            <div>
              <p className="font-display text-2xl text-forest">Message sent</p>
              <p className="mt-2 text-stone-600">Saved to MongoDB — our team will reply soon.</p>
              <button type="button" className="btn-outline mt-6" onClick={() => setSent(false)}>
                Send another
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="label">Name</label>
                <input className="input" required name="name" />
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input" type="email" required name="email" />
              </div>
              <div>
                <label className="label">Message</label>
                <textarea className="input min-h-32" required name="message" />
              </div>
              {error && <p className="text-sm font-medium text-red-600">{error}</p>}
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send message'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
