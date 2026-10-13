import { useState, type FormEvent } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/solutions', label: 'Solutions' },
  { to: '/projects', label: 'Projects' },
  { to: '/resources', label: 'Resources' },
  { to: '/about', label: 'About' },
]

export function Navbar() {
  const { itemCount } = useCart()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function onSearch(e: FormEvent) {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop')
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-leaf/10 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-leaf text-sm font-bold text-white">
            DG
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-forest">
            DripGrow
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-mist text-forest' : 'text-stone-600 hover:bg-mist/60 hover:text-forest'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={onSearch} className="ml-auto hidden max-w-xs flex-1 md:block">
          <input
            className="input"
            placeholder="Search products…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
          />
        </form>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Link
            to="/orders"
            className="rounded-lg p-2 text-stone-600 transition hover:bg-mist hover:text-forest"
            aria-label="My orders"
            title="My orders"
          >
            <UserIcon />
          </Link>
          <Link
            to="/cart"
            className="relative rounded-lg p-2 text-stone-600 transition hover:bg-mist hover:text-forest"
            aria-label="Cart"
          >
            <CartIcon />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber px-1 text-[11px] font-bold text-soil">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-stone-600 hover:bg-mist lg:hidden"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-leaf/10 bg-white px-4 py-3 lg:hidden">
          <form onSubmit={onSearch} className="mb-3 md:hidden">
            <input
              className="input"
              placeholder="Search products…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-mist text-forest' : 'text-stone-700'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/calculator" className="rounded-md px-3 py-2.5 text-sm font-medium text-leaf" onClick={() => setOpen(false)}>
              Plan Your System
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 5h2l2.2 10.4a2 2 0 002 1.6h7.6a2 2 0 001.9-1.5L21 8H7" />
      <circle cx="10" cy="20" r="1.2" fill="currentColor" />
      <circle cx="17" cy="20" r="1.2" fill="currentColor" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}
