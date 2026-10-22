import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function About() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 lg:px-6">
      <h1 className="font-display text-4xl text-forest">{t('pages.about')}</h1>
      <p className="mt-4 text-lg leading-relaxed text-stone-700">
        {t('pages.aboutText')}
      </p>
      <p className="mt-4 leading-relaxed text-stone-600">
        Shop online with Cash on Delivery, use our calculator to size a starter kit, or book a full
        project from survey through maintenance.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/shop" className="btn-primary">
          {t('home.shop')}
        </Link>
        <Link to="/contact" className="btn-outline">
          {t('pages.talk')}
        </Link>
      </div>
    </div>
  )
}
