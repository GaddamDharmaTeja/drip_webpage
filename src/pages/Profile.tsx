import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Profile() {
  const { customer, updateProfile } = useAuth()
  const [saved, setSaved] = useState(false)
  const [fullName, setFullName] = useState(customer?.fullName ?? '')
  const [phone, setPhone] = useState(customer?.phone ?? '')
  const [email, setEmail] = useState(customer?.email ?? '')
  if (!customer) return <Navigate to="/sign-in" replace />
  function submit(e: React.FormEvent) { e.preventDefault(); updateProfile({ fullName, phone, email }); setSaved(true) }
  return <div className="mx-auto max-w-3xl px-4 py-10 lg:px-6"><p className="text-sm font-semibold uppercase tracking-wide text-leaf">My Farm</p><h1 className="mt-1 font-display text-4xl text-forest">Profile and addresses</h1><p className="mt-2 text-stone-600">Keep your contact and delivery information current for a faster checkout.</p><form className="mt-8 rounded-2xl border border-leaf/10 bg-white p-6" onSubmit={submit}><div className="grid gap-4 sm:grid-cols-2"><ProfileField label="Full name" value={fullName} onChange={setFullName} /><ProfileField label="Mobile number" value={phone} onChange={setPhone} /><div className="sm:col-span-2"><ProfileField label="Email address" value={email} onChange={setEmail} type="email" /></div></div>{saved && <p className="mt-4 text-sm font-semibold text-leaf">Your profile has been saved.</p>}<button className="btn-primary mt-6" type="submit">Save profile changes</button></form><section className="mt-8 rounded-2xl border border-leaf/10 bg-white p-6"><h2 className="font-display text-2xl text-forest">Saved delivery addresses</h2>{customer.addresses.length ? <ul className="mt-4 grid gap-3 sm:grid-cols-2">{customer.addresses.map((address, index) => <li key={`${address.line1}-${index}`} className="rounded-xl bg-mist/50 p-4 text-sm text-stone-700"><strong>{address.fullName}</strong><br />{address.line1}{address.line2 ? `, ${address.line2}` : ''}<br />{address.city}, {address.state} {address.pincode}<br />{address.phone}</li>)}</ul> : <p className="mt-3 text-sm text-stone-600">Your delivery addresses will appear here after you place an order while signed in.</p>}</section></div>
}

function ProfileField({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) { return <div><label className="label">{label}</label><input required className="input" type={type} value={value} onChange={(e) => onChange(e.target.value)} /></div> }
