// Type definitions for the application

export type UserRole = 'CUSTOMER' | 'ADMIN' | 'VENDOR'
export type AddressType = 'SHIPPING' | 'BILLING'
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'

export interface User {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
  phone?: string | null
  role: UserRole
  emailVerified: boolean
  isActive: boolean
  lastLogin?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string | null
  shortDescription?: string | null
  categoryId: string
  brand?: string | null
  sku: string
  price: number
  comparePrice?: number | null
  costPrice?: number | null
  stockQuantity: number
  lowStockThreshold: number
  weight?: number | null
  dimensions?: string | null
  isActive: boolean
  isFeatured: boolean
  isDigital: boolean
  requiresShipping: boolean
  trackQuantity: boolean
  allowBackorder: boolean
  metaTitle?: string | null
  metaDescription?: string | null
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface ProductImage {
  id: string
  productId: string
  url: string
  alt?: string | null
  sortOrder: number
  isPrimary: boolean
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  image?: string | null
  icon?: string | null
  parentId?: string | null
  sortOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  id: string
  userId: string
  productId: string
  quantity: number
  price: number
  createdAt: Date
  updatedAt: Date
}

export interface WishlistItem {
  id: string
  userId: string
  productId: string
  createdAt: Date
}

export interface Order {
  id: string
  userId: string
  orderNumber: string
  status: OrderStatus
  subtotal: number
  tax: number
  shipping: number
  total: number
  paymentStatus: PaymentStatus
  paymentMethod?: string | null
  shippingAddress?: any
  billingAddress?: any
  notes?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  id: string
  userId: string
  productId: string
  rating: number
  title?: string | null
  comment?: string | null
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  details?: any
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

