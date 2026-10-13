import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { fileUrl } from '../lib/api'
import { formatINR } from '../lib/money'
import type { Product } from '../types'

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-leaf/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link to={`/product/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-mist">
        <img
          src={fileUrl(product.image)}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.bestseller && (
          <span className="absolute left-3 top-3 rounded-md bg-amber px-2 py-0.5 text-xs font-bold text-soil">
            Bestseller
          </span>
        )}
        {!product.inStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-soil/45 text-sm font-semibold text-white">
            Out of stock
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-leaf">{product.category}</p>
        <Link to={`/product/${product.slug}`} className="mt-1 font-semibold text-soil hover:text-leaf">
          {product.name}
        </Link>
        <div className="mt-2 flex items-center gap-1 text-sm text-stone-600">
          <span className="text-amber">★</span>
          <span>{product.rating}</span>
          <span className="text-stone-400">({product.reviewCount})</span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-forest">{formatINR(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-stone-400 line-through">{formatINR(product.originalPrice)}</span>
          )}
        </div>
        <button
          type="button"
          className="btn-primary mt-auto w-full"
          disabled={!product.inStock}
          onClick={() => addItem({ productId: product.id, quantity: 1 })}
        >
          {product.inStock ? 'Add to Cart' : 'Unavailable'}
        </button>
      </div>
    </article>
  )
}
