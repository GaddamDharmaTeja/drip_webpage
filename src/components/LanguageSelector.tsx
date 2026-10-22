import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { bundledLanguages, isLanguageCode, loadPublishedTranslations, type AppLanguage } from '../i18n'

const apiBase = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '')

function languageName(code: string) {
  try {
    return new Intl.DisplayNames(['en'], { type: 'language' }).of(code) ?? code
  } catch { return code }
}

export function LanguageSelector() {
  const { i18n, t } = useTranslation()
  const [languages, setLanguages] = useState<string[]>([...bundledLanguages])
  const language: AppLanguage = isLanguageCode(i18n.language) ? i18n.language : 'en'

  useEffect(() => {
    void fetch(`${apiBase}/locales`)
      .then((response) => response.ok ? response.json() as Promise<unknown> : [])
      .then((data) => {
        if (Array.isArray(data)) {
          setLanguages([...new Set([...bundledLanguages, ...data.filter((value): value is string => typeof value === 'string' && isLanguageCode(value))])])
        }
      })
      .catch(() => undefined)
  }, [])

  async function selectLanguage(value: string) {
    if (!isLanguageCode(value)) return
    await loadPublishedTranslations(value)
    await i18n.changeLanguage(value)
  }
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{t('common.language')}</span>
      <select
        aria-label={t('common.language')}
        className="min-w-20 rounded-lg border border-leaf/20 bg-white px-2 py-2 text-sm font-medium text-forest focus:outline-none focus:ring-2 focus:ring-leaf/30"
        value={language}
        onChange={(event) => void selectLanguage(event.target.value)}
      >
        {languages.map((code) => (
          <option key={code} value={code}>
            {code === 'en' ? t('common.english') : code === 'te' ? t('common.telugu') : languageName(code)}
          </option>
        ))}
      </select>
    </label>
  )
}
