export function formatINR(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export const categories = [
  'Complete Systems',
  'Pipes',
  'Emitters',
  'Filters',
  'Kits',
  'Controllers',
] as const

export const cropTypes = [
  'Vegetables',
  'Fruits',
  'Greenhouse',
  'Field Crops',
  'Orchard',
] as const

export const brands = ['DripGrow', 'AquaRoot', 'PipeLine Pro'] as const
