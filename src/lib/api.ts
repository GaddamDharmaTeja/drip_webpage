import type { Address, DeliveryOption, Order, Product } from '../types'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const body = (await res.json()) as { message?: string }
      if (body.message) message = body.message
    } catch {
      /* ignore */
    }
    throw new Error(message)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export type ProductQuery = {
  category?: string
  crop?: string
  brand?: string
  maxPrice?: number
  inStockOnly?: boolean
  q?: string
  sort?: string
}

export function fetchProducts(query: ProductQuery = {}) {
  const params = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === '' || value === false) return
    params.set(key, String(value))
  })
  const qs = params.toString()
  return request<Product[]>(`/products${qs ? `?${qs}` : ''}`)
}

export function fetchProductBySlug(slug: string) {
  return request<Product>(`/products/${encodeURIComponent(slug)}`)
}

export function createOrder(payload: {
  items: Array<{
    productId: string
    quantity: number
    farmSize?: string
    cropType?: string
  }>
  address: Address
  delivery: DeliveryOption
}) {
  return request<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function fetchOrders(phone?: string) {
  const qs = phone ? `?phone=${encodeURIComponent(phone)}` : ''
  return request<Order[]>(`/orders${qs}`)
}

export function fetchOrder(orderNumber: string) {
  return request<Order>(`/orders/${encodeURIComponent(orderNumber)}`)
}

export function submitContact(payload: { name: string; email: string; message: string }) {
  return request<{ id: string; status: string }>('/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
