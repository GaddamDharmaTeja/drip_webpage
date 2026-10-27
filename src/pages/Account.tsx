import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrdersContext'

export function Account() {
  const { customer, savedPlans, signOut } = useAuth()
  const { orders } = useOrders()
  const navigate = useNavigate()

  if (!customer) return <Navigate to="/sign-in" replace />

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 lg:px-6 lg:py-8">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="account-menu-card h-fit p-5 lg:sticky lg:top-24"><div className="flex items-center gap-3 border-b border-leaf/10 pb-5"><div className="grid h-12 w-12 place-items-center rounded-full bg-mist text-xl font-bold text-leaf">{customer.fullName.charAt(0).toUpperCase()}</div><div><p className="text-xs text-stone-500">Welcome back,</p><p className="font-semibold text-soil">{customer.fullName}</p></div></div><nav className="mt-4 grid gap-1"><FarmLink to="/profile" icon="♙" label="My profile & addresses" /><FarmLink to="/orders" icon="▣" label="My orders" badge={orders.length} /><FarmLink to="/calculator" icon="◌" label="Farm calculator" /><FarmLink to="/contact" icon="?" label="Support & settings" /></nav><button type="button" className="mt-5 w-full rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50" onClick={() => { signOut(); navigate('/sign-in') }}>Sign out</button></aside>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-leaf">My Farm</p>
          <h1 className="mt-1 font-display text-4xl text-forest">Your farm dashboard</h1>
          <p className="mt-1 text-stone-600">Orders, saved irrigation plans, and delivery details in one place.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Summary label="Orders" value={String(orders.length)} detail="Track every delivery" to="/orders" />
            <Summary label="Saved plans" value={String(savedPlans.length)} detail="Your irrigation recommendations" to="/calculator" />
            <Summary label="Addresses" value={String(customer.addresses.length)} detail="Manage delivery locations" to="/profile" />
          </div>
          <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-leaf/10 bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div><h2 className="font-display text-2xl text-forest">Recent orders</h2><p className="mt-1 text-sm text-stone-600">Follow the status of kits ordered for your farm.</p></div>
            <Link to="/orders" className="text-sm font-semibold text-leaf hover:text-forest">View all orders</Link>
          </div>
          {orders.length ? <ul className="mt-5 divide-y divide-leaf/10">{orders.slice(0, 3).map((order) => <li key={order.id} className="flex items-center justify-between gap-3 py-3 text-sm"><span><strong className="font-mono text-soil">{order.id}</strong><span className="block text-stone-500">{order.items.length} product{order.items.length === 1 ? '' : 's'}</span></span><span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-forest">{order.status}</span></li>)}</ul> : <Empty text="You have no orders yet. Browse complete systems and components when you are ready." action="Shop irrigation products" to="/shop" />}
        </div>
        <div className="rounded-2xl border border-leaf/10 bg-white p-6">
          <div className="flex items-center justify-between gap-4"><div><h2 className="font-display text-2xl text-forest">Saved farm plans</h2><p className="mt-1 text-sm text-stone-600">Your calculator recommendations, ready when you need them.</p></div><Link to="/calculator" className="text-sm font-semibold text-leaf hover:text-forest">Plan a system</Link></div>
          {savedPlans.length ? <ul className="mt-5 divide-y divide-leaf/10">{savedPlans.slice(0, 3).map((plan) => <li key={plan.id} className="py-3 text-sm"><strong className="text-soil">{plan.farmSize} acre · {plan.crop}</strong><span className="block text-stone-500">{plan.waterSource} water source · {plan.recommendationCount} recommended products</span></li>)}</ul> : <Empty text="Save a plan after using the irrigation calculator to keep its farm details here." action="Plan my system" to="/calculator" />}
        </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function Summary({ label, value, detail, to }: { label: string; value: string; detail: string; to: string }) {
  return <Link to={to} className="account-menu-card p-4 transition hover:-translate-y-0.5 hover:border-leaf/30"><p className="text-sm font-semibold text-stone-600">{label}</p><p className="mt-1 font-display text-2xl text-forest">{value}</p><p className="mt-1 text-xs text-stone-500">{detail}</p></Link>
}

function FarmLink({ to, icon, label, badge }: { to: string; icon: string; label: string; badge?: number }) { return <Link to={to} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-stone-700 hover:bg-mist hover:text-forest"><span className="w-5 text-center text-leaf">{icon}</span><span className="flex-1">{label}</span>{badge !== undefined && <span className="rounded-full bg-mist px-2 py-0.5 text-xs text-forest">{badge}</span>}<span className="text-stone-400">›</span></Link> }

function Empty({ text, action, to }: { text: string; action: string; to: string }) {
  return <div className="mt-5 rounded-xl bg-mist/50 p-5 text-sm text-stone-600"><p>{text}</p><Link className="mt-3 inline-block font-semibold text-leaf hover:text-forest" to={to}>{action} →</Link></div>
}
