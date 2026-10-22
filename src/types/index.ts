export type ProductCategory =
  | 'Complete Systems'
  | 'Pipes'
  | 'Emitters'
  | 'Filters'
  | 'Kits'
  | 'Controllers'

export type CropType = 'Vegetables' | 'Fruits' | 'Greenhouse' | 'Field Crops' | 'Orchard'

export interface Product {
  id: string
  name: string
  slug: string
  category: ProductCategory
  cropTypes: CropType[]
  brand: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  image: string
  images: string[]
  bestseller?: boolean
  inStock: boolean
  shortDescription: string
  description: string
  specifications: Record<string, string>
  packageIncludes: string[]
  farmSizes: string[]
}

export interface CartItem {
  productId: string
  quantity: number
  farmSize?: string
  cropType?: CropType
}

export interface Address {
  fullName: string
  phone: string
  email: string
  line1: string
  line2: string
  city: string
  state: string
  pincode: string
}

export interface Customer {
  id: string
  fullName: string
  phone: string
  email: string
  addresses: Address[]
}

export interface SavedPlan {
  id: string
  createdAt: string
  farmSize: string
  crop: string
  waterSource: string
  recommendationCount: number
}

export type DeliveryOption = 'standard' | 'express'

export interface Order {
  id: string
  createdAt: string
  items: Array<CartItem & { name: string; price: number; image: string }>
  address: Address
  delivery: DeliveryOption
  paymentMethod: 'cod'
  subtotal: number
  deliveryFee: number
  total: number
  status: 'Confirmed' | 'Accepted' | 'Shipped' | 'Delivered' | 'Cancelled'
}

export interface Article {
  id: string
  title: string
  excerpt: string
  tag: 'Guides' | 'Crop Specific' | 'Installation' | 'Case Studies'
  image: string
  readTime: string
}

export interface ProjectCase {
  id: string
  title: string
  location: string
  crop: string
  area: string
  image: string
  summary: string
}
