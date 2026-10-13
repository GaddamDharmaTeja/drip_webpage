import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useOrders } from '../context/OrdersContext'
import { useProducts } from '../context/ProductContext'
import { formatINR } from '../lib/money'
import type { Address, DeliveryOption } from '../types'

const emptyAddress: Address = {
  fullName: '',
  phone: '',
  email: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
}

const steps = ['Address', 'Delivery', 'Payment', 'Review'] as const

export function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const { getById } = useProducts()
  const { placeOrder } = useOrders()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [address, setAddress] = useState<Address>(emptyAddress)
  const [delivery, setDelivery] = useState<DeliveryOption>('standard')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const deliveryFee = delivery === 'express' ? 399 : subtotal >= 5000 ? 0 : 199
  const total = subtotal + deliveryFee

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl text-forest">Nothing to checkout</h1>
        <Link to="/shop" className="btn-primary mt-6">
          Shop products
        </Link>
      </div>
    )
  }

  function validateAddress() {
    if (!address.fullName || !address.phone || !address.line1 || !address.city || !address.state || !address.pincode) {
      setError('Please fill all required address fields.')
      return false
    }
    if (!/^\d{10}$/.test(address.phone.replace(/\s/g, ''))) {
      setError('Enter a valid 10-digit phone number.')
      return false
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      setError('Enter a valid 6-digit pincode.')
      return false
    }
    setError('')
    return true
  }

  function next() {
    if (step === 0 && !validateAddress()) return
    setStep((s) => Math.min(s + 1, steps.length - 1))
  }

  async function placeCodOrder() {
    setSubmitting(true)
    setError('')
    try {
      const order = await placeOrder({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          farmSize: item.farmSize,
          cropType: item.cropType,
        })),
        address,
        delivery,
      })
      clearCart()
      navigate(`/orders?placed=${encodeURIComponent(order.id)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not place order')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <h1 className="font-display text-4xl text-forest">Checkout</h1>
      <p className="mt-1 text-stone-600">Pay with Cash on Delivery at your doorstep.</p>

      <ol className="mt-8 flex flex-wrap gap-2">
        {steps.map((label, i) => (
          <li
            key={label}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              i === step
                ? 'bg-leaf text-white'
                : i < step
                  ? 'bg-mist text-forest'
                  : 'bg-white text-stone-400 border border-stone-200'
            }`}
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-leaf/10 bg-white p-6">
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name *" value={address.fullName} onChange={(v) => setAddress({ ...address, fullName: v })} />
              <Field label="Phone *" value={address.phone} onChange={(v) => setAddress({ ...address, phone: v })} />
              <Field label="Email" value={address.email} onChange={(v) => setAddress({ ...address, email: v })} className="sm:col-span-2" />
              <Field label="Address line 1 *" value={address.line1} onChange={(v) => setAddress({ ...address, line1: v })} className="sm:col-span-2" />
              <Field label="Address line 2" value={address.line2} onChange={(v) => setAddress({ ...address, line2: v })} className="sm:col-span-2" />
              <Field label="City *" value={address.city} onChange={(v) => setAddress({ ...address, city: v })} />
              <Field label="State *" value={address.state} onChange={(v) => setAddress({ ...address, state: v })} />
              <Field label="Pincode *" value={address.pincode} onChange={(v) => setAddress({ ...address, pincode: v })} />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <DeliveryCard
                selected={delivery === 'standard'}
                title="Standard delivery"
                detail={subtotal >= 5000 ? 'Free · 5–7 business days' : '₹199 · 5–7 business days'}
                onSelect={() => setDelivery('standard')}
              />
              <DeliveryCard
                selected={delivery === 'express'}
                title="Express delivery"
                detail="₹399 · 2–3 business days"
                onSelect={() => setDelivery('express')}
              />
            </div>
          )}

          {step === 2 && (
            <div className="rounded-xl border-2 border-leaf bg-mist/40 p-5">
              <label className="flex cursor-pointer items-start gap-3">
                <input type="radio" checked readOnly className="mt-1 accent-leaf" />
                <div>
                  <p className="font-semibold text-forest">Cash on Delivery</p>
                  <p className="mt-1 text-sm text-stone-600">
                    Pay in cash when your irrigation kit arrives. No online payment required.
                  </p>
                </div>
              </label>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-sm text-stone-700">
              <div>
                <p className="font-semibold text-forest">Ship to</p>
                <p className="mt-1">
                  {address.fullName}, {address.phone}
                  <br />
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ''}
                  <br />
                  {address.city}, {address.state} {address.pincode}
                </p>
              </div>
              <div>
                <p className="font-semibold text-forest">Delivery</p>
                <p className="mt-1">{delivery === 'express' ? 'Express' : 'Standard'}</p>
              </div>
              <div>
                <p className="font-semibold text-forest">Payment</p>
                <p className="mt-1">Cash on Delivery</p>
              </div>
            </div>
          )}

          {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}

          <div className="mt-6 flex flex-wrap gap-3">
            {step > 0 && (
              <button type="button" className="btn-outline" onClick={() => setStep((s) => s - 1)} disabled={submitting}>
                Back
              </button>
            )}
            {step < steps.length - 1 ? (
              <button type="button" className="btn-primary" onClick={next}>
                Continue
              </button>
            ) : (
              <button type="button" className="btn-primary" onClick={() => void placeCodOrder()} disabled={submitting}>
                {submitting ? 'Placing order…' : 'Place COD Order'}
              </button>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-leaf/10 bg-white p-6">
          <h2 className="font-display text-xl text-forest">Order summary</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => {
              const product = getById(item.productId)
              if (!product) return null
              return (
                <li key={item.productId} className="flex justify-between gap-3 text-sm">
                  <span className="text-stone-600">
                    {product.name} × {item.quantity}
                  </span>
                  <span className="font-medium">{formatINR(product.price * item.quantity)}</span>
                </li>
              )
            })}
          </ul>
          <div className="mt-4 space-y-2 border-t border-leaf/10 pt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? 'Free' : formatINR(deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-forest">
              <span>Total (COD)</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  className = '',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  className?: string
}) {
  return (
    <div className={className}>
      <label className="label">{label}</label>
      <input className="input" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

function DeliveryCard({
  selected,
  title,
  detail,
  onSelect,
}: {
  selected: boolean
  title: string
  detail: string
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-xl border-2 p-4 text-left transition ${
        selected ? 'border-leaf bg-mist/40' : 'border-stone-200 hover:border-leaf/40'
      }`}
    >
      <p className="font-semibold text-soil">{title}</p>
      <p className="mt-1 text-sm text-stone-600">{detail}</p>
    </button>
  )
}
