import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function SignIn() {
  const { createAccount, signIn } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'sign-in' | 'create'>('sign-in')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const cleanPhone = phone.replace(/\s/g, '')
    if (!/^\d{10}$/.test(cleanPhone)) { setError('Enter the 10-digit mobile number you use for farm orders.'); return }
    if (mode === 'create') {
      if (!fullName.trim() || !email.trim()) { setError('Enter your full name and email address to create your account.'); return }
      try { await createAccount({ fullName: fullName.trim(), phone: cleanPhone, email: email.trim(), password }); navigate('/my-farm') } catch (err) { setError(err instanceof Error ? err.message : 'Could not create your account. Please try again.') }
      return
    }
    try { await signIn(cleanPhone, password); navigate('/my-farm') } catch (err) { setError(err instanceof Error ? err.message : 'Could not sign in. Please try again.') }
  }

  return <div className="mx-auto max-w-md px-4 py-14"><div className="rounded-2xl border border-leaf/10 bg-white p-7 shadow-sm"><p className="text-sm font-semibold uppercase tracking-wide text-leaf">My Farm</p><h1 className="mt-2 font-display text-4xl text-forest">{mode === 'create' ? 'Create your account' : 'Sign in to your account'}</h1><p className="mt-3 text-sm leading-relaxed text-stone-600">{mode === 'create' ? 'Save farm plans, delivery addresses, and order history in one simple place.' : 'Use the mobile number and password linked to your DripGrow account.'}</p><div className="mt-6 grid grid-cols-2 rounded-lg bg-mist p-1"><button type="button" onClick={() => { setMode('sign-in'); setError('') }} className={`rounded-md px-3 py-2 text-sm font-semibold ${mode === 'sign-in' ? 'bg-white text-forest shadow-sm' : 'text-stone-600'}`}>Sign in</button><button type="button" onClick={() => { setMode('create'); setError('') }} className={`rounded-md px-3 py-2 text-sm font-semibold ${mode === 'create' ? 'bg-white text-forest shadow-sm' : 'text-stone-600'}`}>Create account</button></div><form className="mt-6 space-y-4" onSubmit={(e) => void submit(e)}>{mode === 'create' && <><Field label="Full name" value={fullName} onChange={setFullName} autoComplete="name" /><Field label="Email address" value={email} onChange={setEmail} type="email" autoComplete="email" /></>}<Field label="Mobile number" value={phone} onChange={setPhone} type="tel" autoComplete="tel" placeholder="10-digit mobile number" /><Field label="Password" value={password} onChange={setPassword} type="password" autoComplete={mode === 'create' ? 'new-password' : 'current-password'} placeholder="At least 8 characters" />{error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}<button className="btn-primary w-full" type="submit">{mode === 'create' ? 'Create My Farm account' : 'Sign in to My Farm'}</button></form><p className="mt-5 text-center text-xs text-stone-500">You can continue shopping as a guest at any time. <Link to="/shop" className="font-semibold text-leaf">Browse products</Link></p></div></div>
}

function Field({ label, value, onChange, type = 'text', autoComplete, placeholder }: { label: string; value: string; onChange: (value: string) => void; type?: string; autoComplete?: string; placeholder?: string }) { return <div><label className="label">{label}</label><input required className="input" type={type} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} placeholder={placeholder} /></div> }
