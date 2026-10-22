import { Link } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { useProducts } from '../context/ProductContext'
import { processSteps, solutions } from '../data/content'
import { useTranslation } from 'react-i18next'

const categories = [
  { name: 'Pipes', emoji: '═' },
  { name: 'Emitters', emoji: '◦' },
  { name: 'Filters', emoji: '◎' },
  { name: 'Kits', emoji: '▣' },
  { name: 'Controllers', emoji: '◷' },
  { name: 'Complete Systems', emoji: '◆' },
]

const values = [
  { title: 'Save Water', detail: 'Targeted delivery cuts waste at the root zone.' },
  { title: 'Increase Yield', detail: 'Steady moisture for healthier crop cycles.' },
  { title: 'High Quality', detail: 'Field-tested components with clear warranties.' },
  { title: 'Expert Support', detail: 'Design help from survey through handover.' },
]

export function Home() {
  const { t } = useTranslation()
  const { products, loading, error } = useProducts()
  const featured = products
    .filter((p) => p.bestseller || p.category === 'Complete Systems')
    .slice(0, 4)

  return (
    <div>
      <section className="relative isolate min-h-[88vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1800&q=80"
          alt={t('home.title')}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-soil/85 via-soil/55 to-forest/35" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-4 py-20 lg:px-6">
          <p className="font-display text-5xl font-semibold tracking-tight text-white sm:text-6xl md:text-7xl">
            DripGrow
          </p>
          <h1 className="mt-4 max-w-xl text-2xl font-medium leading-snug text-white/95 sm:text-3xl">
            {t('home.title')}
          </h1>
          <p className="mt-4 max-w-md text-base text-white/75">
            {t('home.description')}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className="btn-primary">
              {t('home.shop')}
            </Link>
            <Link to="/calculator" className="btn-secondary">
              {t('home.plan')}
            </Link>
            <Link to="/contact" className="btn-secondary">
              {t('home.quote')}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-leaf/10 bg-white/80 p-5">
              <div className="mb-3 h-1 w-10 rounded-full bg-leaf-light" />
              <h2 className="font-display text-xl text-forest">{v.title}</h2>
              <p className="mt-2 text-sm text-stone-600">{v.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-6">
        <div className="mb-8">
          <h2 className="font-display text-3xl text-forest">{t('home.categories')}</h2>
          <p className="mt-1 text-stone-600">{t('home.categoriesDesc')}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.name}
              to={`/shop?category=${encodeURIComponent(c.name)}`}
              className="flex flex-col items-center gap-3 rounded-full border border-leaf/15 bg-white px-4 py-6 text-center transition hover:border-leaf hover:bg-mist"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-mist text-xl text-leaf">
                {c.emoji}
              </span>
              <span className="text-sm font-semibold text-soil">{t(`data.${c.name}`)}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white/60 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl text-forest">{t('home.featured')}</h2>
              <p className="mt-1 text-stone-600">{t('home.featuredDesc')}</p>
            </div>
            <Link to="/shop" className="text-sm font-semibold text-leaf hover:text-forest">
              {t('home.viewAll')}
            </Link>
          </div>
          {error && (
            <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error} — start MongoDB and the Spring Boot API on port 8080.
            </p>
          )}
          {loading ? (
            <p className="text-stone-600">{t('shop.loading')}</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <h2 className="font-display text-3xl text-forest">{t('home.projects')}</h2>
        <p className="mt-1 text-stone-600">{t('home.projectsDesc')}</p>
        <ol className="mt-10 grid gap-4 md:grid-cols-5">
          {processSteps.map((step, i) => (
            <li key={step.title} className="relative rounded-2xl border border-leaf/10 bg-white p-5">
              <span className="font-display text-3xl text-leaf-light/80">{i + 1}</span>
              <h3 className="mt-2 font-semibold text-soil">{step.title}</h3>
              <p className="mt-1 text-sm text-stone-600">{step.detail}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <Link to="/projects" className="btn-outline">
            {t('home.recentProjects')}
          </Link>
        </div>
      </section>

      <section className="border-t border-leaf/10 bg-mist/50 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <h2 className="font-display text-3xl text-forest">{t('home.solutions')}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {solutions.map((s) => (
              <Link
                key={s.title}
                to="/solutions"
                className="group overflow-hidden rounded-2xl border border-leaf/10 bg-white"
              >
                <div className="aspect-[5/3] overflow-hidden">
                  <img src={s.image} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-soil">{s.title}</h3>
                  <p className="mt-1 text-sm text-stone-600">{s.blurb}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
