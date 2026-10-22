import { useState } from 'react'
import { articles } from '../data/content'
import { useTranslation } from 'react-i18next'

const tags = ['All', 'Guides', 'Crop Specific', 'Installation', 'Case Studies'] as const

export function Resources() {
  const { t } = useTranslation()
  const [tag, setTag] = useState<(typeof tags)[number]>('All')
  const list = tag === 'All' ? articles : articles.filter((a) => a.tag === tag)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <h1 className="font-display text-4xl text-forest">{t('pages.resources')}</h1>
      <p className="mt-1 text-stone-600">{t('pages.resourcesText')}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTag(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              tag === t ? 'bg-leaf text-white' : 'bg-white text-stone-600 border border-stone-200 hover:border-leaf'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((a) => (
          <article key={a.id} className="overflow-hidden rounded-2xl border border-leaf/10 bg-white">
            <img src={a.image} alt="" className="aspect-[16/10] w-full object-cover" />
            <div className="p-5">
              <span className="text-xs font-semibold uppercase tracking-wide text-leaf">{a.tag}</span>
              <h2 className="mt-1 font-semibold text-soil">{a.title}</h2>
              <p className="mt-2 text-sm text-stone-600">{a.excerpt}</p>
              <p className="mt-3 text-xs text-stone-400">{a.readTime} read</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
