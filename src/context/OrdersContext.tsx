import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { createOrder, fetchCustomerOrders } from '../lib/api'
import type { Address, DeliveryOption, Order } from '../types'
import { useAuth } from './AuthContext'

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
  refresh: () => Promise<void>
  placeOrder: (input: PlaceOrderInput) => Promise<Order>
  getOrder: (id: string) => Order | undefined
}

const OrdersContext = createContext<OrdersContextValue | null>(null)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { customer } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchCustomerOrders()
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
    if (customer?.phone) void refresh()
    else setOrders([])
  }, [customer?.phone, refresh])

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
