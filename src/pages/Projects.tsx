import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { processSteps, projects as fallbackProjects } from '../data/content'
import { fileUrl } from '../lib/api'
import { useTranslation } from 'react-i18next'

type ProjectCase = {
  id: string
  title: string
  location: string
  crop: string
  area: string
  image: string
  summary: string
}

export function Projects() {
  const { t } = useTranslation()
  const [projects, setProjects] = useState<ProjectCase[]>(
    fallbackProjects.map((p) => ({ ...p })),
  )

  useEffect(() => {
    void fetch('/api/projects')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: ProjectCase[]) => {
        if (Array.isArray(data) && data.length) setProjects(data)
      })
      .catch(() => {
        /* keep fallback */
      })
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <h1 className="font-display text-4xl text-forest">{t('pages.projects')}</h1>
      <p className="mt-1 text-stone-600">{t('pages.projectsText')}</p>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {projects.map((p) => (
          <article key={p.id} className="overflow-hidden rounded-2xl border border-leaf/10 bg-white">
            <img src={fileUrl(p.image)} alt="" className="aspect-[16/10] w-full object-cover" />
            <div className="p-5">
              <h2 className="font-semibold text-soil">{p.title}</h2>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-leaf">
                {p.location} · {p.area}
              </p>
              <p className="mt-2 text-sm text-stone-600">{p.summary}</p>
              <p className="mt-2 text-sm text-stone-500">{t('calculator.cropType')}: {p.crop}</p>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="font-display text-3xl text-forest">{t('pages.process')}</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-5">
          {processSteps.map((step, i) => (
            <li key={step.title} className="rounded-2xl border border-leaf/10 bg-white p-5">
              <span className="font-display text-3xl text-leaf-light/80">{i + 1}</span>
              <h3 className="mt-2 font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-stone-600">{step.detail}</p>
            </li>
          ))}
        </ol>
        <Link to="/contact" className="btn-primary mt-8">
          {t('pages.startProject')}
        </Link>
      </section>
    </div>
  )
}
