import { Link } from 'react-router-dom'

export function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 lg:px-6">
      <h1 className="font-display text-4xl text-forest">About DripGrow</h1>
      <p className="mt-4 text-lg leading-relaxed text-stone-700">
        DripGrow builds and supplies smart irrigation systems for Indian farms — from kitchen gardens
        to multi-acre orchards. We combine reliable hardware, practical design, and on-ground
        installation so every litre of water works harder.
      </p>
      <p className="mt-4 leading-relaxed text-stone-600">
        Shop online with Cash on Delivery, use our calculator to size a starter kit, or book a full
        project from survey through maintenance.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/shop" className="btn-primary">
          Shop products
        </Link>
        <Link to="/contact" className="btn-outline">
          Talk to us
        </Link>
      </div>
    </div>
  )
}
