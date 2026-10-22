import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Address, Customer, SavedPlan } from '../types'
import { loginCustomer, registerCustomer, setCustomerToken } from '../lib/api'

const CUSTOMER_STORAGE_KEY = 'dripgrow-customer-session'
const PLANS_STORAGE_KEY = 'dripgrow-saved-plans'

type AccountInput = Pick<Customer, 'fullName' | 'phone' | 'email'> & { password: string }
type ProfileInput = Pick<Customer, 'fullName' | 'phone' | 'email'>
type StoredSession = { customer: Customer; token: string }

interface AuthContextValue {
  customer: Customer | null
  savedPlans: SavedPlan[]
  createAccount: (input: AccountInput) => Promise<void>
  signIn: (phone: string, password: string) => Promise<void>
  signOut: () => void
  updateProfile: (input: ProfileInput) => void
  saveAddress: (address: Address) => void
  savePlan: (plan: Omit<SavedPlan, 'id' | 'createdAt'>) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(() => readStorage<StoredSession | null>(CUSTOMER_STORAGE_KEY, null)?.customer ?? null)
  const [token, setToken] = useState<string | null>(() => readStorage<StoredSession | null>(CUSTOMER_STORAGE_KEY, null)?.token ?? null)
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>(() => readStorage(PLANS_STORAGE_KEY, []))

  useEffect(() => {
    setCustomerToken(token)
    if (customer && token) localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify({ customer, token }))
    else localStorage.removeItem(CUSTOMER_STORAGE_KEY)
  }, [customer, token])

  useEffect(() => {
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(savedPlans))
  }, [savedPlans])

  const createAccount = useCallback(async (input: AccountInput) => {
    const session = await registerCustomer(input)
    setCustomer({ ...session.customer, addresses: [] })
    setToken(session.token)
  }, [])

  const signIn = useCallback(async (phone: string, password: string) => {
    const session = await loginCustomer({ phone, password })
    setCustomer((current) => ({ ...session.customer, addresses: current?.phone === session.customer.phone ? current.addresses : [] }))
    setToken(session.token)
  }, [])

  const signOut = useCallback(() => { setCustomer(null); setToken(null); setCustomerToken(null) }, [])

  const updateProfile = useCallback((input: ProfileInput) => {
    setCustomer((current) => (current ? { ...current, ...input } : current))
  }, [])

  const saveAddress = useCallback((address: Address) => {
    setCustomer((current) => {
      if (!current) return current
      const withoutMatching = current.addresses.filter((item) =>
        item.line1 !== address.line1 || item.pincode !== address.pincode,
      )
      return { ...current, addresses: [address, ...withoutMatching] }
    })
  }, [])

  const savePlan = useCallback((plan: Omit<SavedPlan, 'id' | 'createdAt'>) => {
    if (!customer) return false
    setSavedPlans((plans) => [{ id: `plan-${Date.now()}`, createdAt: new Date().toISOString(), ...plan }, ...plans])
    return true
  }, [customer])

  const value = useMemo(() => ({
    customer, savedPlans, createAccount, signIn, signOut, updateProfile, saveAddress, savePlan,
  }), [customer, savedPlans, createAccount, signIn, signOut, updateProfile, saveAddress, savePlan])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
