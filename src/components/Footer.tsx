import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-leaf/10 bg-soil text-stone-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <div>
          <p className="font-display text-2xl font-semibold text-white">DripGrow</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone-400">
            Smart irrigation systems that help farms save water, raise yield, and grow with confidence.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-leaf-light">Shop</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-white" to="/shop">All products</Link></li>
            <li><Link className="hover:text-white" to="/shop?category=Complete%20Systems">Complete systems</Link></li>
            <li><Link className="hover:text-white" to="/calculator">Irrigation calculator</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-leaf-light">Company</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-white" to="/about">About</Link></li>
            <li><Link className="hover:text-white" to="/projects">Projects</Link></li>
            <li><Link className="hover:text-white" to="/resources">Resources</Link></li>
            <li><Link className="hover:text-white" to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-leaf-light">Get a quote</p>
          <p className="mt-3 text-sm text-stone-400">Talk to an irrigation specialist.</p>
          <Link to="/contact" className="btn-primary mt-4">
            Contact us
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} DripGrow. Cash on Delivery available nationwide*.
      </div>
    </footer>
  )
}
