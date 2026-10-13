import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { useProducts } from '../context/ProductContext'
import { brands, categories, cropTypes } from '../lib/money'
import type { CropType } from '../types'

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating'

export function Shop() {
  const { products, loading, error } = useProducts()
  const [params] = useSearchParams()
  const q = (params.get('q') ?? '').toLowerCase()
  const paramCategory = params.get('category') ?? ''

  const [category, setCategory] = useState(paramCategory)
  const [crop, setCrop] = useState('')
  const [brand, setBrand] = useState('')
  const [maxPrice, setMaxPrice] = useState(40000)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sort, setSort] = useState<SortKey>('featured')

  useEffect(() => {
    setCategory(paramCategory)
  }, [paramCategory])

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q) && !p.shortDescription.toLowerCase().includes(q)) {
        return false
      }
      if (category && p.category !== category) return false
      if (crop && !p.cropTypes.includes(crop as CropType)) return false
      if (brand && p.brand !== brand) return false
      if (p.price > maxPrice) return false
      if (inStockOnly && !p.inStock) return false
      return true
    })

    list = [...list].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'rating') return b.rating - a.rating
      return Number(b.bestseller) - Number(a.bestseller)
    })
    return list
  }, [products, category, crop, brand, maxPrice, inStockOnly, sort, q])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-forest">Shop</h1>
        <p className="mt-1 text-stone-600">Irrigation systems and components for every farm.</p>
      </div>

      {error && (
        <p className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit space-y-6 rounded-2xl border border-leaf/10 bg-white p-5 lg:sticky lg:top-24">
          <FilterGroup title="Category">
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </FilterGroup>

          <FilterGroup title="Crop type">
            <select className="input" value={crop} onChange={(e) => setCrop(e.target.value)}>
              <option value="">All</option>
              {cropTypes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </FilterGroup>

          <FilterGroup title={`Price up to ₹${maxPrice.toLocaleString('en-IN')}`}>
            <input
              type="range"
              min={500}
              max={40000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-leaf"
            />
          </FilterGroup>

          <FilterGroup title="Brand">
            <select className="input" value={brand} onChange={(e) => setBrand(e.target.value)}>
              <option value="">All</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </FilterGroup>

          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="accent-leaf"
            />
            In stock only
          </label>

          <button
            type="button"
            className="btn-outline w-full"
            onClick={() => {
              setCategory('')
              setCrop('')
              setBrand('')
              setMaxPrice(40000)
              setInStockOnly(false)
            }}
          >
            Reset filters
          </button>
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-stone-600">
              {category || 'All products'} ({filtered.length})
              {q ? ` · “${q}”` : ''}
            </p>
            <select
              className="input w-auto"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>

          {loading ? (
            <p className="text-stone-600">Loading products…</p>
          ) : filtered.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-leaf/30 bg-white p-10 text-center text-stone-600">
              No products match these filters.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="label">{title}</p>
      {children}
    </div>
  )
}
