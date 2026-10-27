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
import {
  createCustomerAddress, deleteCustomerAddress, fetchCustomerProfile, loginCustomer, registerCustomer,
  setCustomerToken, setDefaultCustomerAddress, updateCustomerAddress, updateCustomerProfile,
} from '../lib/api'

const CUSTOMER_STORAGE_KEY = 'dripgrow-customer-session'
const PLANS_STORAGE_KEY = 'dripgrow-saved-plans'

type AccountInput = Pick<Customer, 'fullName' | 'phone' | 'email'> & { password: string }
type ProfileInput = Pick<Customer, 'fullName' | 'phone' | 'email'>
type StoredSession = { token: string }

interface AuthContextValue {
  customer: Customer | null
  loading: boolean
  savedPlans: SavedPlan[]
  createAccount: (input: AccountInput) => Promise<void>
  signIn: (phone: string, password: string) => Promise<void>
  signOut: () => void
  updateProfile: (input: ProfileInput) => Promise<void>
  addAddress: (address: Address) => Promise<void>
  updateAddress: (id: string, address: Address) => Promise<void>
  setDefaultAddress: (id: string) => Promise<void>
  deleteAddress: (id: string) => Promise<void>
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
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [token, setToken] = useState<string | null>(() => readStorage<StoredSession | null>(CUSTOMER_STORAGE_KEY, null)?.token ?? null)
  const [loading, setLoading] = useState(true)
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>(() => readStorage(PLANS_STORAGE_KEY, []))

  useEffect(() => {
    setCustomerToken(token)
    if (token) localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify({ token }))
    else localStorage.removeItem(CUSTOMER_STORAGE_KEY)
  }, [customer, token])

  useEffect(() => {
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(savedPlans))
  }, [savedPlans])

  useEffect(() => {
    if (!token) { setLoading(false); return }
    setCustomerToken(token)
    void fetchCustomerProfile()
      .then(setCustomer)
      .catch(() => { setCustomer(null); setToken(null) })
      .finally(() => setLoading(false))
  }, [token])

  const createAccount = useCallback(async (input: AccountInput) => {
    const session = await registerCustomer(input)
    setToken(session.token)
    setCustomer(session.customer)
  }, [])

  const signIn = useCallback(async (phone: string, password: string) => {
    const session = await loginCustomer({ phone, password })
    setToken(session.token)
    setCustomer(session.customer)
  }, [])

  const signOut = useCallback(() => { setCustomer(null); setToken(null); setCustomerToken(null) }, [])

  const updateProfile = useCallback(async (input: ProfileInput) => setCustomer(await updateCustomerProfile(input)), [])

  const addAddress = useCallback(async (address: Address) => setCustomer(await createCustomerAddress(address)), [])
  const updateAddress = useCallback(async (id: string, address: Address) => setCustomer(await updateCustomerAddress(id, address)), [])
  const setDefaultAddress = useCallback(async (id: string) => setCustomer(await setDefaultCustomerAddress(id)), [])
  const deleteAddress = useCallback(async (id: string) => setCustomer(await deleteCustomerAddress(id)), [])

  const savePlan = useCallback((plan: Omit<SavedPlan, 'id' | 'createdAt'>) => {
    if (!customer) return false
    setSavedPlans((plans) => [{ id: `plan-${Date.now()}`, createdAt: new Date().toISOString(), ...plan }, ...plans])
    return true
  }, [customer])

  const value = useMemo(() => ({
    customer, loading, savedPlans, createAccount, signIn, signOut, updateProfile, addAddress, updateAddress, setDefaultAddress, deleteAddress, savePlan,
  }), [customer, loading, savedPlans, createAccount, signIn, signOut, updateProfile, addAddress, updateAddress, setDefaultAddress, deleteAddress, savePlan])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
