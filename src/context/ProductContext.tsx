import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { fetchProducts } from '../lib/api'
import type { Product } from '../types'

interface ProductContextValue {
  products: Product[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  getById: (id: string) => Product | undefined
  getBySlug: (slug: string) => Product | undefined
}

const ProductContext = createContext<ProductContextValue | null>(null)

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchProducts()
      setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const getById = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products],
  )

  const getBySlug = useCallback(
    (slug: string) => products.find((p) => p.slug === slug),
    [products],
  )

  const value = useMemo(
    () => ({ products, loading, error, refresh, getById, getBySlug }),
    [products, loading, error, refresh, getById, getBySlug],
  )

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export function useProducts() {
  const ctx = useContext(ProductContext)
  if (!ctx) throw new Error('useProducts must be used within ProductProvider')
  return ctx
}
