import { Link } from 'react-router-dom'
import { solutions } from '../data/content'

export function Solutions() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <h1 className="font-display text-4xl text-forest">Solutions</h1>
      <p className="mt-1 max-w-2xl text-stone-600">
        End-to-end irrigation setups matched to crop type, water source, and plot geometry.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {solutions.map((s) => (
          <article key={s.title} className="overflow-hidden rounded-2xl border border-leaf/10 bg-white">
            <div className="aspect-[16/9] overflow-hidden">
              <img src={s.image} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="p-6">
              <h2 className="font-display text-2xl text-forest">{s.title}</h2>
              <p className="mt-2 text-stone-600">{s.blurb}</p>
              <Link to="/calculator" className="btn-primary mt-5">
                Plan this system
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
