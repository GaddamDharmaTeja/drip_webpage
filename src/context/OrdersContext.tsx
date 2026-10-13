import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { createOrder, fetchOrders } from '../lib/api'
import type { Address, DeliveryOption, Order } from '../types'

interface PlaceOrderInput {
  items: Array<{
    productId: string
    quantity: number
    farmSize?: string
    cropType?: string
  }>
  address: Address
  delivery: DeliveryOption
}

interface OrdersContextValue {
  orders: Order[]
  loading: boolean
  error: string | null
  refresh: (phone?: string) => Promise<void>
  placeOrder: (input: PlaceOrderInput) => Promise<Order>
  getOrder: (id: string) => Order | undefined
}

const OrdersContext = createContext<OrdersContextValue | null>(null)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async (phone?: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchOrders(phone)
      setOrders(
        data.map((o) => ({
          ...o,
          createdAt: typeof o.createdAt === 'string' ? o.createdAt : String(o.createdAt),
        })),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const placeOrder = useCallback(async (input: PlaceOrderInput) => {
    const order = await createOrder(input)
    const normalized: Order = {
      ...order,
      createdAt:
        typeof order.createdAt === 'string' ? order.createdAt : String(order.createdAt),
    }
    setOrders((prev) => [normalized, ...prev.filter((o) => o.id !== normalized.id)])
    return normalized
  }, [])

  const getOrder = useCallback(
    (id: string) => orders.find((o) => o.id === id),
    [orders],
  )

  const value = useMemo(
    () => ({ orders, loading, error, refresh, placeOrder, getOrder }),
    [orders, loading, error, refresh, placeOrder, getOrder],
  )

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider')
  return ctx
}
