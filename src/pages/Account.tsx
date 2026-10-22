import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrdersContext'

export function Account() {
  const { customer, savedPlans, signOut } = useAuth()
  const { orders } = useOrders()
  const navigate = useNavigate()

  if (!customer) return <Navigate to="/sign-in" replace />

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-leaf">My Farm</p>
          <h1 className="font-display text-4xl text-forest">Welcome back, {customer.fullName.split(' ')[0]}</h1>
          <p className="mt-1 text-stone-600">Keep your irrigation orders, plans, and delivery details in one place.</p>
        </div>
        <button type="button" className="btn-outline" onClick={() => { signOut(); navigate('/') }}>Sign out</button>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Summary label="Orders" value={String(orders.length)} detail="Track every delivery" to="/orders" />
        <Summary label="Saved plans" value={String(savedPlans.length)} detail="Return to your recommendations" to="/calculator" />
        <Summary label="Saved addresses" value={String(customer.addresses.length)} detail="Speed up checkout" to="/profile" />
        <Summary label="Need help?" value="Talk to us" detail="Quotes and installation support" to="/contact" />
      </div>

      <section className="mt-12 grid gap-8 lg:grid-cols-2">
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
  )
}

function Summary({ label, value, detail, to }: { label: string; value: string; detail: string; to: string }) {
  return <Link to={to} className="rounded-2xl border border-leaf/10 bg-white p-5 transition hover:-translate-y-0.5 hover:border-leaf/30"><p className="text-sm font-semibold text-stone-600">{label}</p><p className="mt-2 font-display text-2xl text-forest">{value}</p><p className="mt-2 text-xs text-stone-500">{detail}</p></Link>
}

function Empty({ text, action, to }: { text: string; action: string; to: string }) {
  return <div className="mt-5 rounded-xl bg-mist/50 p-5 text-sm text-stone-600"><p>{text}</p><Link className="mt-3 inline-block font-semibold text-leaf hover:text-forest" to={to}>{action} →</Link></div>
}
