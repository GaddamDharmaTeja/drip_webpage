import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="mt-auto border-t border-leaf/10 bg-soil text-stone-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <div>
          <p className="font-display text-2xl font-semibold text-white">DripGrow</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone-400">
            {t('home.description')}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-leaf-light">{t('nav.shop')}</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-white" to="/shop">{t('shop.products')}</Link></li>
            <li><Link className="hover:text-white" to="/shop?category=Complete%20Systems">{t('data.Complete Systems')}</Link></li>
            <li><Link className="hover:text-white" to="/calculator">{t('calculator.title')}</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-leaf-light">Learn & support</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-white" to="/about">{t('nav.about')}</Link></li>
            <li><Link className="hover:text-white" to="/learn">Learn</Link></li>
            <li><Link className="hover:text-white" to="/projects">Farm stories</Link></li>
            <li><Link className="hover:text-white" to="/resources">Guides and tips</Link></li>
            <li><Link className="hover:text-white" to="/my-farm">My Farm</Link></li>
            <li><Link className="hover:text-white" to="/contact">{t('pages.contact')}</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-leaf-light">{t('home.quote')}</p>
          <p className="mt-3 text-sm text-stone-400">{t('pages.contactText')}</p>
          <Link to="/contact" className="btn-primary mt-4">
            {t('pages.contact')}
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} DripGrow. Cash on Delivery available nationwide*.
      </div>
    </footer>
  )
}
