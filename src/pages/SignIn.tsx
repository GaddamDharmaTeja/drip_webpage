import { useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { submitPasswordRecovery } from '../lib/api'

export function SignIn() {
  const { createAccount, signIn, customer, loading } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [mode, setMode] = useState<'sign-in' | 'create'>('sign-in')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [recoveryOpen, setRecoveryOpen] = useState(false)
  const [recoveryName, setRecoveryName] = useState('')
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [recoveryPhone, setRecoveryPhone] = useState('')
  const [recoveryMessage, setRecoveryMessage] = useState('')
  const destination = params.get('next')?.startsWith('/') ? params.get('next')! : '/my-farm'

  if (!loading && customer) return <Navigate to={destination} replace />

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const cleanPhone = phone.replace(/\s/g, '')
    if (!/^\d{10}$/.test(cleanPhone)) { setError('Enter the 10-digit mobile number you use for farm orders.'); return }
    if (mode === 'create') {
      if (!fullName.trim() || !email.trim()) { setError('Enter your full name and email address to create your account.'); return }
      try { await createAccount({ fullName: fullName.trim(), phone: cleanPhone, email: email.trim(), password }); navigate(destination, { replace: true }) } catch (err) { setError(err instanceof Error ? err.message : 'Could not create your account. Please try again.') }
      return
    }
    try { await signIn(cleanPhone, password); navigate(destination, { replace: true }) } catch (err) { setError(err instanceof Error ? err.message : 'Could not sign in. Please try again.') }
  }

  async function submitRecovery(e: React.FormEvent) {
    e.preventDefault()
    const cleanPhone = recoveryPhone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '')
    if (!recoveryName.trim() || !recoveryEmail.trim() || !/^\d{10}$/.test(cleanPhone)) { setRecoveryMessage('Enter your name, registered email, and 10-digit mobile number.'); return }
    try {
      await submitPasswordRecovery({ name: recoveryName.trim(), email: recoveryEmail.trim(), phone: cleanPhone, accountType: 'customer' })
      setRecoveryMessage('Recovery request sent. DripGrow support will verify your account before helping reset it.')
    } catch (err) { setRecoveryMessage(err instanceof Error ? err.message : 'Could not submit your recovery request.') }
  }

  return <div className="auth-shell"><div className="auth-panel"><div className="auth-brand"><span>DG</span><p>DripGrow</p></div><p className="text-sm font-semibold uppercase tracking-wide text-leaf">Your farm, connected</p><h1 className="mt-2 font-display text-4xl text-forest">{mode === 'create' ? 'Create your account' : 'Welcome back'}</h1><p className="mt-3 text-sm leading-relaxed text-stone-600">{mode === 'create' ? 'Keep your farm addresses, orders, and irrigation plans together.' : 'Sign in to browse products, manage delivery addresses, and order for your farm.'}</p><div className="mt-6 grid grid-cols-2 rounded-xl bg-mist p-1"><button type="button" onClick={() => { setMode('sign-in'); setError('') }} className={`rounded-lg px-3 py-2 text-sm font-semibold ${mode === 'sign-in' ? 'bg-white text-forest shadow-sm' : 'text-stone-600'}`}>Sign in</button><button type="button" onClick={() => { setMode('create'); setError('') }} className={`rounded-lg px-3 py-2 text-sm font-semibold ${mode === 'create' ? 'bg-white text-forest shadow-sm' : 'text-stone-600'}`}>Create account</button></div><form className="mt-6 space-y-4" onSubmit={(e) => void submit(e)}>{mode === 'create' && <><Field label="Full name" value={fullName} onChange={setFullName} autoComplete="name" /><Field label="Email address" value={email} onChange={setEmail} type="email" autoComplete="email" /></>}<Field label="Mobile number" value={phone} onChange={setPhone} type="tel" autoComplete="tel" placeholder="10-digit mobile number" /><Field label="Password" value={password} onChange={setPassword} type="password" autoComplete={mode === 'create' ? 'new-password' : 'current-password'} placeholder="At least 8 characters" />{error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}<button className="btn-primary w-full" type="submit">{mode === 'create' ? 'Create My Farm account' : 'Sign in to DripGrow'}</button></form>{mode === 'sign-in' && <button type="button" className="mt-5 w-full text-center text-sm font-semibold text-leaf hover:text-forest" onClick={() => { setRecoveryOpen(true); setRecoveryMessage('') }}>Forgot password?</button>}{recoveryOpen && <div className="modal-backdrop"><form className="modal-card" onSubmit={(event) => void submitRecovery(event)}><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-wide text-leaf">Account recovery</p><h2 className="mt-1 font-display text-2xl text-forest">Forgot your password?</h2></div><button type="button" className="text-2xl text-stone-400" onClick={() => setRecoveryOpen(false)}>×</button></div><p className="mt-3 text-sm text-stone-600">Send a verified recovery request to the DripGrow support team. No reset code is sent automatically.</p><div className="mt-5 space-y-4"><Field label="Full name" value={recoveryName} onChange={setRecoveryName} /><Field label="Registered email address" value={recoveryEmail} onChange={setRecoveryEmail} type="email" /><Field label="Mobile number" value={recoveryPhone} onChange={setRecoveryPhone} type="tel" placeholder="10-digit mobile number" />{recoveryMessage && <p className="rounded-lg bg-mist px-3 py-2 text-sm text-forest">{recoveryMessage}</p>}<button className="btn-primary w-full">Send recovery request</button></div></form></div>}</div></div>
}

function Field({ label, value, onChange, type = 'text', autoComplete, placeholder }: { label: string; value: string; onChange: (value: string) => void; type?: string; autoComplete?: string; placeholder?: string }) { return <div><label className="label">{label}</label><input required className="input" type={type} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} placeholder={placeholder} /></div> }
