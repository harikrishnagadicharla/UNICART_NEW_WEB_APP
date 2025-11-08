import { create } from 'zustand'
import { Product } from '@/data/products'
import { mockProducts } from '@/data/products'

interface ProductStore {
  products: Product[]
  loadProducts: () => void
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviews'>) => void
  updateProduct: (id: number, updates: Partial<Product>) => void
  deleteProduct: (id: number) => void
  getProductById: (id: number) => Product | undefined
}

const STORAGE_KEY = 'unicart-admin-products'

const getStoredProducts = (): Product[] => {
  if (typeof window === 'undefined') return mockProducts
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : mockProducts
  } catch {
    return mockProducts
  }
}

const saveStoredProducts = (products: Product[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  } catch {
    // Ignore storage errors
  }
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: typeof window !== 'undefined' ? getStoredProducts() : mockProducts,

  loadProducts: () => {
    const stored = getStoredProducts()
    set({ products: stored })
  },

  addProduct: (productData) => {
    const products = get().products
    const newProduct: Product = {
      ...productData,
      id: Math.max(...products.map(p => p.id), 0) + 1,
      reviews: 0,
      rating: 0,
    }
    const updatedProducts = [...products, newProduct]
    set({ products: updatedProducts })
    saveStoredProducts(updatedProducts)
  },

  updateProduct: (id, updates) => {
    const products = get().products
    const updatedProducts = products.map(p =>
      p.id === id ? { ...p, ...updates } : p
    )
    set({ products: updatedProducts })
    saveStoredProducts(updatedProducts)
  },

  deleteProduct: (id) => {
    const products = get().products
    const updatedProducts = products.filter(p => p.id !== id)
    set({ products: updatedProducts })
    saveStoredProducts(updatedProducts)
  },

  getProductById: (id) => {
    return get().products.find(p => p.id === id)
  },
}))

