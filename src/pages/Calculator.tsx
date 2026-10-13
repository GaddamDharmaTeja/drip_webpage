import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductContext'

const steps = ['Farm Details', 'Crop Details', 'Water Source', 'Results'] as const

export function Calculator() {
  const { products } = useProducts()
  const { addItem } = useCart()
  const [step, setStep] = useState(0)
  const [farmSize, setFarmSize] = useState('1')
  const [shape, setShape] = useState<'Rectangular' | 'Circular'>('Rectangular')
  const [length, setLength] = useState('100')
  const [width, setWidth] = useState('40')
  const [crop, setCrop] = useState('Vegetables')
  const [rowSpacing, setRowSpacing] = useState('60')
  const [plantSpacing, setPlantSpacing] = useState('30')
  const [source, setSource] = useState('Borewell')
  const [flowRate, setFlowRate] = useState('5')
  const [pressure, setPressure] = useState('2')

  const recommendations = useMemo(() => {
    const acres = Number(farmSize) || 1
    let list = products.filter((p) => p.inStock)

    if (crop === 'Vegetables' || crop === 'Field Crops') {
      list = list.filter(
        (p) =>
          p.cropTypes.includes('Vegetables') ||
          p.cropTypes.includes('Field Crops') ||
          p.category === 'Filters' ||
          p.category === 'Controllers',
      )
    } else if (crop === 'Fruits' || crop === 'Orchard') {
      list = list.filter(
        (p) =>
          p.cropTypes.includes('Fruits') ||
          p.cropTypes.includes('Orchard') ||
          p.category === 'Filters',
      )
    } else if (crop === 'Greenhouse') {
      list = list.filter((p) => p.cropTypes.includes('Greenhouse') || p.category === 'Controllers')
    }

    const systems = list.filter((p) => p.category === 'Complete Systems' || p.category === 'Kits')
    const extras = list.filter((p) => p.category === 'Filters' || p.category === 'Controllers')
    const picked = [...systems.slice(0, acres >= 2 ? 2 : 1), ...extras.slice(0, 2)]
    return picked.length ? picked : products.filter((p) => p.bestseller).slice(0, 3)
  }, [products, farmSize, crop])

  function next() {
    setStep((s) => Math.min(s + 1, steps.length - 1))
  }

  function addAll() {
    recommendations.forEach((p) => addItem({ productId: p.id, quantity: 1, cropType: crop as never }))
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 lg:px-6">
      <h1 className="font-display text-4xl text-forest">Irrigation Requirement Calculator</h1>
      <p className="mt-1 text-stone-600">Answer a few questions to get a starter kit recommendation.</p>

      <ol className="mt-8 flex flex-wrap gap-2">
        {steps.map((label, i) => (
          <li
            key={label}
            className={`rounded-full px-3 py-1 text-xs font-semibold sm:text-sm ${
              i === step ? 'bg-leaf text-white' : i < step ? 'bg-mist text-forest' : 'bg-white text-stone-400 border'
            }`}
          >
            {label}
          </li>
        ))}
      </ol>

      <div className="mt-8 rounded-2xl border border-leaf/10 bg-white p-6">
        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Farm size (acres)</label>
              <input className="input" value={farmSize} onChange={(e) => setFarmSize(e.target.value)} />
            </div>
            <div>
              <label className="label">Shape</label>
              <select className="input" value={shape} onChange={(e) => setShape(e.target.value as typeof shape)}>
                <option>Rectangular</option>
                <option>Circular</option>
              </select>
            </div>
            {shape === 'Rectangular' && (
              <>
                <div>
                  <label className="label">Length (m)</label>
                  <input className="input" value={length} onChange={(e) => setLength(e.target.value)} />
                </div>
                <div>
                  <label className="label">Width (m)</label>
                  <input className="input" value={width} onChange={(e) => setWidth(e.target.value)} />
                </div>
              </>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Crop type</label>
              <select className="input" value={crop} onChange={(e) => setCrop(e.target.value)}>
                <option>Vegetables</option>
                <option>Fruits</option>
                <option>Greenhouse</option>
                <option>Field Crops</option>
                <option>Orchard</option>
              </select>
            </div>
            <div>
              <label className="label">Row spacing (cm)</label>
              <input className="input" value={rowSpacing} onChange={(e) => setRowSpacing(e.target.value)} />
            </div>
            <div>
              <label className="label">Plant spacing (cm)</label>
              <input className="input" value={plantSpacing} onChange={(e) => setPlantSpacing(e.target.value)} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Water source</label>
              <select className="input" value={source} onChange={(e) => setSource(e.target.value)}>
                <option>Borewell</option>
                <option>Well</option>
                <option>Canal</option>
                <option>Tank</option>
              </select>
            </div>
            <div>
              <label className="label">Flow rate (LPS)</label>
              <input className="input" value={flowRate} onChange={(e) => setFlowRate(e.target.value)} />
            </div>
            <div>
              <label className="label">Pressure (kg/cm²)</label>
              <input className="input" value={pressure} onChange={(e) => setPressure(e.target.value)} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="text-sm text-stone-600">
              Based on ~{farmSize} acre {crop.toLowerCase()} plot with {source.toLowerCase()} source
              {shape === 'Rectangular' ? ` (${length}×${width} m)` : ''}, we recommend:
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {recommendations.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" className="btn-primary" onClick={addAll}>
                Add all to cart
              </button>
              <Link to="/shop" className="btn-outline">
                Browse more
              </Link>
            </div>
          </div>
        )}

        {step < 3 && (
          <div className="mt-6 flex gap-3">
            {step > 0 && (
              <button type="button" className="btn-outline" onClick={() => setStep((s) => s - 1)}>
                Back
              </button>
            )}
            <button type="button" className="btn-primary" onClick={next}>
              {step === 2 ? 'See recommendations' : 'Continue'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
