import { Link, useSearchParams } from 'react-router-dom'
import { useOrders } from '../context/OrdersContext'
import { formatINR } from '../lib/money'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

export function Orders() {
  const { t } = useTranslation()
  const { orders, loading, error, getOrder } = useOrders()
  const { customer } = useAuth()
  const [params] = useSearchParams()
  const placedId = params.get('placed')
  const placed = placedId ? getOrder(placedId) : undefined

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <h1 className="font-display text-4xl text-forest">{t('pages.orders')}</h1>
      <p className="mt-1 text-stone-600">Track every DripGrow delivery and its latest status.</p>

      {!customer && <div className="mt-6 rounded-2xl border border-leaf/20 bg-mist/50 p-5"><p className="font-semibold text-forest">Sign in to see your orders</p><p className="mt-1 text-sm text-stone-600">Your purchase history is kept inside My Farm, together with saved plans and addresses.</p><Link to="/sign-in" className="btn-primary mt-4">Sign in to My Farm</Link></div>}

      {placed && (
        <div className="mt-6 rounded-2xl border border-leaf/30 bg-mist/60 p-5">
          <p className="font-semibold text-forest">{t('pages.orderPlaced')}</p>
          <p className="mt-1 text-sm text-stone-700">
            Order <span className="font-mono font-semibold">{placed.id}</span> confirmed. Pay{' '}
            <strong>{formatINR(placed.total)}</strong> in cash on delivery.
          </p>
        </div>
      )}

      {error && (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {customer && (loading ? (
        <p className="mt-10 text-stone-600">Loading orders…</p>
      ) : orders.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-leaf/30 bg-white p-10 text-center">
          <p className="text-stone-600">{t('pages.noOrders')}</p>
          <Link to="/shop" className="btn-primary mt-4">
            {t('pages.startShopping')}
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-leaf/10 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-leaf/10 bg-mist/40 text-stone-600">
              <tr>
                <th className="px-4 py-3 font-semibold">{t('pages.order')}</th>
                <th className="px-4 py-3 font-semibold">{t('pages.date')}</th>
                <th className="px-4 py-3 font-semibold">{t('pages.items')}</th>
                <th className="px-4 py-3 font-semibold">{t('cart.total')}</th>
                <th className="px-4 py-3 font-semibold">{t('checkout.payment')}</th>
                <th className="px-4 py-3 font-semibold">{t('pages.status')}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-leaf/5">
                  <td className="px-4 py-4 font-mono font-semibold text-soil">{order.id}</td>
                  <td className="px-4 py-4 text-stone-600">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-4 text-stone-600">
                    {order.items.reduce((n, i) => n + i.quantity, 0)} item(s)
                  </td>
                  <td className="px-4 py-4 font-semibold">{formatINR(order.total)}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-md bg-mist px-2 py-0.5 text-xs font-semibold text-leaf">COD</span>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const tones: Record<string, string> = {
    Confirmed: 'bg-sky-50 text-sky-800',
    Accepted: 'bg-emerald-50 text-emerald-800',
    Shipped: 'bg-amber-50 text-amber-800',
    Delivered: 'bg-mist text-forest',
    Cancelled: 'bg-red-50 text-red-700',
  }
  return (
    <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${tones[status] ?? 'bg-stone-100'}`}>
      {status}
    </span>
  )
}
