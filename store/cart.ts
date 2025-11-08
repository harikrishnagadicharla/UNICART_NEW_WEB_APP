import { create } from 'zustand'

export interface CartItem {
  id: string // Changed to string to match API
  productId: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    slug: string
    price: number
    stockQuantity: number
    image: string | null
    imageAlt: string | null
  }
}

interface CartStore {
  items: CartItem[]
  isLoading: boolean
  error: string | null
  addToCart: (productId: string, quantity?: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getTotalItems: () => number
  getTotalPrice: () => number
  fetchCart: () => Promise<void>
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  
  fetchCart: async () => {
    try {
      set({ isLoading: true, error: null })
      
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('unicart-auth-token') 
        : null

      console.log('[fetchCart] Token exists:', !!token)

      if (!token) {
        // No token means user is not authenticated, clear cart silently
        console.log('[fetchCart] No token, clearing cart silently')
        set({ items: [], isLoading: false, error: null })
        return
      }

      console.log('[fetchCart] Making request to /api/cart')

      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      console.log('[fetchCart] Response status:', response.status, response.statusText)

      if (!response.ok) {
        if (response.status === 401) {
          // Not authenticated, clear cart and token
          console.log('[fetchCart] 401 Unauthorized - removing token')
          localStorage.removeItem('unicart-auth-token')
          set({ items: [], isLoading: false, error: null })
          return
        }
        
        // Try to get error message from response
        let errorMessage = `Failed to fetch cart (${response.status})`
        try {
          const errorData = await response.json()
          console.error('[fetchCart] Error response:', errorData)
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          console.error('[fetchCart] Failed to parse error response:', e)
          try {
            const text = await response.text()
            console.error('[fetchCart] Error response text:', text)
            if (text) errorMessage = text
          } catch {}
        }
        
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('[fetchCart] Success response:', data)
      
      if (data.success && Array.isArray(data.items)) {
        console.log('[fetchCart] Setting', data.items.length, 'items')
        set({ items: data.items, isLoading: false, error: null })
      } else {
        // Invalid response format, set empty cart
        console.warn('[fetchCart] Invalid response format:', data)
        set({ items: [], isLoading: false, error: null })
      }
    } catch (error) {
      console.error('❌ Error fetching cart:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to load cart'
      set({ 
        error: errorMessage,
        isLoading: false,
        items: [] // Clear items on error
      })
    }
  },

  addToCart: async (productId: string, quantity: number = 1) => {
    try {
      console.log('addToCart called with productId:', productId, 'quantity:', quantity)
      
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('unicart-auth-token') 
        : null

      if (!token) {
        const errorMsg = 'Please login to add items to cart'
        console.error('No token found:', errorMsg)
        set({ error: errorMsg })
        throw new Error(errorMsg)
      }

      console.log('Making POST request to /api/cart with:', { productId, quantity })

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      })

      console.log('Cart API response status:', response.status, response.statusText)

      if (!response.ok) {
        let errorMessage = 'Failed to add to cart'
        let errorDetails = null
        
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
          errorDetails = errorData.details || null
          console.error('[addToCart] Error response:', errorData)
        } catch (e) {
          console.error('[addToCart] Failed to parse error response:', e)
          // If response is not JSON, try to get text
          try {
            const text = await response.text()
            console.error('[addToCart] Error response text:', text)
            if (text) errorMessage = text
          } catch {}
        }
        
        if (response.status === 401) {
          // Token expired or invalid, remove it
          localStorage.removeItem('unicart-auth-token')
          errorMessage = 'Session expired. Please login again.'
        }
        
        if (errorDetails) {
          console.error('[addToCart] Validation errors:', errorDetails)
          errorMessage = `${errorMessage}: ${JSON.stringify(errorDetails)}`
        }
        
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('Cart API success response:', data)
      
      if (data.success) {
        // Refetch cart to get updated items
        console.log('Refetching cart after successful add')
        await get().fetchCart()
      } else {
        throw new Error(data.error || 'Failed to add to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to add to cart'
      set({ error: errorMessage })
      throw error
    }
  },

  removeFromCart: async (productId: string) => {
    try {
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('unicart-auth-token') 
        : null

      if (!token) {
        throw new Error('Please login to remove items from cart')
      }

      const response = await fetch(`/api/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to remove from cart')
      }

      // Refetch cart to get updated items
      await get().fetchCart()
    } catch (error) {
      console.error('Error removing from cart:', error)
      set({ error: error instanceof Error ? error.message : 'Failed to remove from cart' })
      throw error
    }
  },

  updateQuantity: async (productId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await get().removeFromCart(productId)
        return
      }

      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('unicart-auth-token') 
        : null

      if (!token) {
        throw new Error('Please login to update cart')
      }

      const response = await fetch(`/api/cart/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      })

      if (!response.ok) {
        throw new Error('Failed to update cart')
      }

      // Refetch cart to get updated items
      await get().fetchCart()
    } catch (error) {
      console.error('Error updating cart:', error)
      set({ error: error instanceof Error ? error.message : 'Failed to update cart' })
      throw error
    }
  },

  clearCart: async () => {
    try {
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('unicart-auth-token') 
        : null

      if (!token) {
        throw new Error('Please login to clear cart')
      }

      // Remove all items one by one (or implement bulk delete endpoint)
      const items = get().items
      for (const item of items) {
        await get().removeFromCart(item.productId)
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
      set({ error: error instanceof Error ? error.message : 'Failed to clear cart' })
      throw error
    }
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0)
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
  },
}))
