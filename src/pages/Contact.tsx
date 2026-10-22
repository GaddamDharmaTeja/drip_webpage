import { useEffect, useState, type FormEvent } from 'react'
import { fetchSiteContact, submitContact, type SiteContact } from '../lib/api'
import { useTranslation } from 'react-i18next'

const fallbackContact: SiteContact = {
  id: 'main',
  title: 'DripGrow HQ',
  address: '12 Agri Tech Park, Nashik Road, Maharashtra 422101',
  email: 'hello@dripgrow.example',
  phone: '+91 98765 43210',
  hours: 'Mon–Sat, 9:00–18:00 IST',
}

export function Contact() {
  const { t } = useTranslation()
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [hq, setHq] = useState<SiteContact>(fallbackContact)

  useEffect(() => {
    void fetchSiteContact()
      .then(setHq)
      .catch(() => {
        /* keep fallback until API is available */
      })
  }, [])

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
      <h1 className="font-display text-4xl text-forest">{t('pages.contact')}</h1>
      <p className="mt-1 text-stone-600">{t('pages.contactText')}</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-leaf/10 bg-soil p-8 text-stone-200">
          <h2 className="font-display text-2xl text-white">{hq.title}</h2>
          <dl className="mt-6 space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-leaf-light">{t('pages.address')}</dt>
              <dd className="mt-1">{hq.address}</dd>
            </div>
            <div>
              <dt className="font-semibold text-leaf-light">{t('common.email')}</dt>
              <dd className="mt-1">{hq.email}</dd>
            </div>
            <div>
              <dt className="font-semibold text-leaf-light">{t('pages.phone')}</dt>
              <dd className="mt-1">{hq.phone}</dd>
            </div>
            <div>
              <dt className="font-semibold text-leaf-light">{t('pages.hours')}</dt>
              <dd className="mt-1">{hq.hours}</dd>
            </div>
          </dl>
        </div>

        <form onSubmit={(e) => void onSubmit(e)} className="rounded-2xl border border-leaf/10 bg-white p-8">
          {sent ? (
            <div>
              <p className="font-display text-2xl text-forest">{t('pages.sent')}</p>
              <p className="mt-2 text-stone-600">{t('pages.sentText')}</p>
              <button type="button" className="btn-outline mt-6" onClick={() => setSent(false)}>
                {t('pages.again')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="label">{t('common.name')}</label>
                <input className="input" required name="name" />
              </div>
              <div>
                <label className="label">{t('common.email')}</label>
                <input className="input" type="email" required name="email" />
              </div>
              <div>
                <label className="label">{t('common.message')}</label>
                <textarea className="input min-h-32" required name="message" />
              </div>
              {error && <p className="text-sm font-medium text-red-600">{error}</p>}
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? t('common.sending') : t('common.send')}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
