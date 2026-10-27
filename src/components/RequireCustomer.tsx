import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { ReactNode } from 'react'

export function RequireCustomer({ children }: { children: ReactNode }) {
  const { customer, loading } = useAuth()
  const location = useLocation()
  if (loading) return <div className="grid min-h-screen place-items-center text-sm font-semibold text-forest">Loading your farm…</div>
  if (!customer) return <Navigate to={`/sign-in?next=${encodeURIComponent(location.pathname + location.search)}`} replace />
  return <>{children}</>
}
