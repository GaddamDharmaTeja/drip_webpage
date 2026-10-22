import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import te from './locales/te.json'

export const bundledLanguages = ['en', 'te'] as const
export type AppLanguage = string

export function isLanguageCode(value: string | null): value is AppLanguage {
  return value != null && /^[a-z]{2,3}$/.test(value)
}

function savedLanguage(): AppLanguage {
  const value = typeof window === 'undefined' ? null : window.localStorage.getItem('language')
  return isLanguageCode(value) ? value : 'en'
}

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, te: { translation: te } },
  lng: savedLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
})

i18n.on('languageChanged', (language) => {
  if (isLanguageCode(language)) window.localStorage.setItem('language', language)
})

export async function loadPublishedTranslations(language: AppLanguage) {
  const apiBase = import.meta.env.VITE_API_URL ?? '/api'
  try {
    const response = await fetch(`${apiBase.replace(/\/$/, '')}/locales/${language}`)
    if (!response.ok) return
    const translations: unknown = await response.json()
    if (!translations || typeof translations !== 'object' || Array.isArray(translations)) return
    i18n.addResourceBundle(language, 'translation', translations, true, true)
  } catch {
    // The bundled locale is intentionally retained when the API is unavailable.
  }
}

const initialLanguage = savedLanguage()
void Promise.all([...bundledLanguages, initialLanguage].filter((value, index, values) => values.indexOf(value) === index).map(loadPublishedTranslations))
  .then(() => i18n.changeLanguage(initialLanguage))

export default i18n
