import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductContext'
import { fetchProductBySlug } from '../lib/api'
import { formatINR } from '../lib/money'
import type { CropType, Product } from '../types'

const tabs = [
  'Description',
  'Specifications',
  'Package Includes',
  'Installation Guide',
  'FAQs',
  'Reviews',
] as const

export function ProductDetail() {
  const { slug } = useParams()
  const { getBySlug } = useProducts()
  const cached = slug ? getBySlug(slug) : undefined
  const [product, setProduct] = useState<Product | undefined>(cached)
  const [loadError, setLoadError] = useState<string | null>(null)
  const { addItem } = useCart()
  const navigate = useNavigate()
  const [activeImage, setActiveImage] = useState(0)
  const [farmSize, setFarmSize] = useState('')
  const [cropType, setCropType] = useState<CropType | ''>('')
  const [tab, setTab] = useState<(typeof tabs)[number]>('Description')

  useEffect(() => {
    if (!slug) return
    if (cached) {
      setProduct(cached)
      return
    }
    void fetchProductBySlug(slug)
      .then(setProduct)
      .catch((err: unknown) => {
        setLoadError(err instanceof Error ? err.message : 'Product not found')
      })
  }, [slug, cached])

  const sizeMultiplier = useMemo(() => {
    if (!farmSize) return 1
    if (farmSize.includes('0.5')) return 0.7
    if (farmSize.includes('2 Acre') || farmSize.includes('2000')) return 1.6
    if (farmSize.includes('3 Acre')) return 2.1
    if (farmSize.includes('5 Acre')) return 2.8
    return 1
  }, [farmSize])

  if (loadError || (!product && !cached)) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl text-forest">
          {loadError ?? 'Loading product…'}
        </h1>
        {loadError && (
          <Link to="/shop" className="btn-primary mt-6">
            Back to shop
          </Link>
        )}
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-stone-600">Loading…</div>
    )
  }

  const displayPrice = Math.round(product.price * sizeMultiplier)
  const discount =
    product.originalPrice != null
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : null

  function addToCart() {
    addItem({
      productId: product!.id,
      quantity: 1,
      farmSize: farmSize || product!.farmSizes[0],
      cropType: cropType || product!.cropTypes[0],
    })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl border border-leaf/10 bg-white">
            <img
              src={product.images[activeImage] ?? product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {product.images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => setActiveImage(i)}
                className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                  i === activeImage ? 'border-leaf' : 'border-transparent'
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          {product.bestseller && (
            <span className="rounded-md bg-amber px-2 py-0.5 text-xs font-bold text-soil">Bestseller</span>
          )}
          <h1 className="mt-2 font-display text-4xl text-forest">{product.name}</h1>
          <p className="mt-2 text-stone-600">{product.shortDescription}</p>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-amber">★ {product.rating}</span>
            <span className="text-stone-400">({product.reviewCount} reviews)</span>
            <span className="text-stone-300">·</span>
            <span className="text-stone-500">{product.brand}</span>
          </div>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold text-forest">{formatINR(displayPrice)}</span>
            {product.originalPrice && (
              <span className="text-stone-400 line-through">{formatINR(product.originalPrice)}</span>
            )}
            {discount != null && discount > 0 && (
              <span className="rounded-md bg-mist px-2 py-0.5 text-sm font-semibold text-leaf">
                {discount}% off
              </span>
            )}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="farmSize">
                Farm Size
              </label>
              <select
                id="farmSize"
                className="input"
                value={farmSize}
                onChange={(e) => setFarmSize(e.target.value)}
              >
                <option value="">Select size</option>
                {product.farmSizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="cropType">
                Crop Type
              </label>
              <select
                id="cropType"
                className="input"
                value={cropType}
                onChange={(e) => setCropType(e.target.value as CropType | '')}
              >
                <option value="">Select crop</option>
                {product.cropTypes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="btn-primary flex-1 min-w-[140px]" disabled={!product.inStock} onClick={addToCart}>
              Add to Cart
            </button>
            <button
              type="button"
              className="btn-outline flex-1 min-w-[140px]"
              disabled={!product.inStock}
              onClick={() => {
                addToCart()
                navigate('/checkout')
              }}
            >
              Buy Now
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link to="/contact" className="font-semibold text-leaf hover:text-forest">
              Request Bulk Quote
            </Link>
            <span className="text-stone-300">·</span>
            <Link to="/contact" className="font-semibold text-leaf hover:text-forest">
              Book Installation
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-14">
        <div className="flex gap-1 overflow-x-auto border-b border-leaf/15">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`shrink-0 px-4 py-3 text-sm font-semibold transition ${
                tab === t ? 'border-b-2 border-leaf text-forest' : 'text-stone-500 hover:text-soil'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="rounded-b-2xl border border-t-0 border-leaf/10 bg-white p-6">
          {tab === 'Description' && <p className="leading-relaxed text-stone-700">{product.description}</p>}
          {tab === 'Specifications' && (
            <dl className="grid gap-3 sm:grid-cols-2">
              {Object.entries(product.specifications).map(([k, v]) => (
                <div key={k} className="rounded-lg bg-mist/50 px-4 py-3">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-leaf">{k}</dt>
                  <dd className="mt-1 text-soil">{v}</dd>
                </div>
              ))}
            </dl>
          )}
          {tab === 'Package Includes' && (
            <ul className="list-inside list-disc space-y-2 text-stone-700">
              {product.packageIncludes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {tab === 'Installation Guide' && (
            <ol className="list-decimal space-y-2 pl-5 text-stone-700">
              <li>Mark mainline path and lay HDPE according to the design sheet.</li>
              <li>Install filtration assembly near the water source.</li>
              <li>Connect laterals and emitters; flush lines before capping ends.</li>
              <li>Pressure-test each zone and schedule the first irrigation cycle.</li>
            </ol>
          )}
          {tab === 'FAQs' && (
            <div className="space-y-4 text-stone-700">
              <div>
                <p className="font-semibold">Do you offer Cash on Delivery?</p>
                <p className="text-sm text-stone-600">Yes. COD is available at checkout for all in-stock items.</p>
              </div>
            </div>
          )}
          {tab === 'Reviews' && (
            <p className="text-stone-600">
              Rated {product.rating}/5 based on {product.reviewCount} verified farm purchases.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
