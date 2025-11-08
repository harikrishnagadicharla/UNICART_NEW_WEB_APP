import { create } from 'zustand'

export interface WishlistItem {
  id: string
  productId: string
  createdAt: Date
  product: {
    id: string
    name: string
    slug: string
    description?: string | null
    shortDescription?: string | null
    brand?: string | null
    price: number
    comparePrice?: number | null
    stockQuantity: number
    isFeatured: boolean
    image: string | null
    imageAlt?: string | null
    category: {
      id: string
      name: string
      slug: string
    }
    rating: number
    reviewsCount: number
  }
}

interface WishlistStore {
  items: WishlistItem[]
  isLoading: boolean
  error: string | null
  addToWishlist: (productId: string) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  clearWishlist: () => Promise<void>
  isInWishlist: (productId: number | string) => boolean
  getWishlistCount: () => number
  fetchWishlist: () => Promise<void>
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchWishlist: async () => {
    try {
      set({ isLoading: true, error: null })
      
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('unicart-auth-token') 
        : null

      console.log('[fetchWishlist] Token exists:', !!token)

      if (!token) {
        console.log('[fetchWishlist] No token, clearing wishlist silently')
        set({ items: [], isLoading: false, error: null })
        return
      }

      console.log('[fetchWishlist] Making request to /api/wishlist')

      const response = await fetch('/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      console.log('[fetchWishlist] Response status:', response.status, response.statusText)

      if (!response.ok) {
        if (response.status === 401) {
          console.log('[fetchWishlist] 401 Unauthorized - removing token')
          localStorage.removeItem('unicart-auth-token')
          set({ items: [], isLoading: false, error: null })
          return
        }
        
        let errorMessage = `Failed to fetch wishlist (${response.status})`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
          console.error('[fetchWishlist] Error response:', errorData)
        } catch (e) {
          console.error('[fetchWishlist] Failed to parse error response:', e)
        }
        
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('[fetchWishlist] Success response:', data)
      
      if (data.success && Array.isArray(data.items)) {
        console.log('[fetchWishlist] Setting', data.items.length, 'items')
        set({ items: data.items, isLoading: false, error: null })
      } else {
        console.warn('[fetchWishlist] Invalid response format:', data)
        set({ items: [], isLoading: false, error: null })
      }
    } catch (error) {
      console.error('❌ Error fetching wishlist:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to load wishlist'
      set({ 
        error: errorMessage,
        isLoading: false,
        items: []
      })
    }
  },

  addToWishlist: async (productId: string) => {
    try {
      console.log('[addToWishlist] Called with productId:', productId)
      
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('unicart-auth-token') 
        : null

      if (!token) {
        const errorMsg = 'Please login to add items to wishlist'
        console.error('[addToWishlist] No token:', errorMsg)
        set({ error: errorMsg })
        throw new Error(errorMsg)
      }

      console.log('[addToWishlist] Making POST request to /api/wishlist')

      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      })

      console.log('[addToWishlist] Response status:', response.status, response.statusText)

      if (!response.ok) {
        let errorMessage = 'Failed to add to wishlist'
        let errorDetails = null
        
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
          errorDetails = errorData.details || null
          console.error('[addToWishlist] Error response:', errorData)
        } catch (e) {
          console.error('[addToWishlist] Failed to parse error response:', e)
        }
        
        if (response.status === 401) {
          localStorage.removeItem('unicart-auth-token')
          errorMessage = 'Session expired. Please login again.'
        }
        
        if (errorDetails) {
          console.error('[addToWishlist] Validation errors:', errorDetails)
          errorMessage = `${errorMessage}: ${JSON.stringify(errorDetails)}`
        }
        
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('[addToWishlist] Success response:', data)
      
      if (data.success) {
        // Refetch wishlist to get updated items
        console.log('[addToWishlist] Refetching wishlist after successful add')
        await get().fetchWishlist()
      } else {
        throw new Error(data.error || 'Failed to add to wishlist')
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to add to wishlist'
      set({ error: errorMessage })
      throw error
    }
  },

  removeFromWishlist: async (productId: string) => {
    try {
      console.log('[removeFromWishlist] Called with productId:', productId)
      
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('unicart-auth-token') 
        : null

      if (!token) {
        throw new Error('Please login to remove items from wishlist')
      }

      const response = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to remove from wishlist')
      }

      // Refetch wishlist to get updated items
      await get().fetchWishlist()
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      set({ error: error instanceof Error ? error.message : 'Failed to remove from wishlist' })
      throw error
    }
  },

  clearWishlist: async () => {
    try {
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('unicart-auth-token') 
        : null

      if (!token) {
        throw new Error('Please login to clear wishlist')
      }

      // Remove all items one by one
      const items = get().items
      for (const item of items) {
        await get().removeFromWishlist(item.productId)
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error)
      set({ error: error instanceof Error ? error.message : 'Failed to clear wishlist' })
      throw error
    }
  },

  isInWishlist: (productId: number | string) => {
    const items = get().items
    const productIdStr = typeof productId === 'number' ? productId.toString() : productId
    return items.some(item => 
      item.productId === productIdStr || 
      item.product.id === productIdStr ||
      (typeof productId === 'number' && item.product.id === productId.toString())
    )
  },

  getWishlistCount: () => {
    return get().items.length
  },
}))
