import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductContext'
import { fileUrl } from '../lib/api'
import { formatINR } from '../lib/money'
import { useTranslation } from 'react-i18next'

export function Cart() {
  const { t } = useTranslation()
  const { items, updateQuantity, removeItem, subtotal } = useCart()
  const { getById } = useProducts()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-4xl text-forest">{t('cart.empty')}</h1>
        <p className="mt-2 text-stone-600">{t('cart.emptyDesc')}</p>
        <Link to="/shop" className="btn-primary mt-6">
          {t('cart.goShop')}
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <h1 className="font-display text-4xl text-forest">{t('cart.title')}</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="overflow-x-auto rounded-2xl border border-leaf/10 bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-leaf/10 bg-mist/40 text-stone-600">
              <tr>
                <th className="px-4 py-3 font-semibold">{t('cart.product')}</th>
                <th className="px-4 py-3 font-semibold">{t('cart.price')}</th>
                <th className="px-4 py-3 font-semibold">{t('cart.quantity')}</th>
                <th className="px-4 py-3 font-semibold">{t('cart.total')}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const product = getById(item.productId)
                if (!product) return null
                return (
                  <tr key={item.productId} className="border-b border-leaf/5">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img src={fileUrl(product.image)} alt="" className="h-14 w-14 rounded-lg object-cover" />
                        <div>
                          <Link to={`/product/${product.slug}`} className="font-semibold text-soil hover:text-leaf">
                            {product.name}
                          </Link>
                          {(item.farmSize || item.cropType) && (
                            <p className="text-xs text-stone-500">
                              {[item.farmSize, item.cropType].filter(Boolean).join(' · ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">{formatINR(product.price)}</td>
                    <td className="px-4 py-4">
                      <div className="inline-flex items-center rounded-lg border border-stone-200">
                        <button
                          type="button"
                          className="px-3 py-1.5 hover:bg-mist"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="min-w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          type="button"
                          className="px-3 py-1.5 hover:bg-mist"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-semibold">{formatINR(product.price * item.quantity)}</td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        className="text-stone-400 hover:text-red-600"
                        onClick={() => removeItem(item.productId)}
                        aria-label={t('common.remove')}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <aside className="h-fit rounded-2xl border border-leaf/10 bg-white p-6">
          <h2 className="font-display text-xl text-forest">{t('cart.summary')}</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-600">{t('cart.subtotal')}</span>
              <span className="font-semibold">{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">{t('cart.delivery')}</span>
              <span className="font-semibold">{subtotal >= 5000 ? t('common.free') : formatINR(199)}</span>
            </div>
            <div className="flex justify-between border-t border-leaf/10 pt-3 text-base">
              <span className="font-semibold">{t('cart.total')}</span>
              <span className="font-bold text-forest">
                {formatINR(subtotal + (subtotal >= 5000 ? 0 : 199))}
              </span>
            </div>
          </div>
          <p className="mt-3 text-xs text-stone-500">{t('cart.payment')}</p>
          <Link to="/checkout" className="btn-primary mt-5 w-full">
            {t('cart.checkout')}
          </Link>
          <Link to="/shop" className="btn-outline mt-3 w-full">
            {t('cart.continueShopping')}
          </Link>
        </aside>
      </div>
    </div>
  )
}
