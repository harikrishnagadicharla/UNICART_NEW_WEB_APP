import { create } from 'zustand'

export interface User {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
  phone?: string | null
  role: 'CUSTOMER' | 'ADMIN' | 'VENDOR'
  emailVerified: boolean
  isActive: boolean
  lastLogin?: Date | null
  createdAt: Date
  updatedAt: Date
}

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  loadFromStorage: () => void
}

const STORAGE_KEY = 'unicart-auth-storage'
const TOKEN_KEY = 'unicart-auth-token'

const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

const saveStoredUser = (user: User | null) => {
  if (typeof window === 'undefined') return
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // Ignore storage errors
  }
}

const saveStoredToken = (token: string | null) => {
  if (typeof window === 'undefined') return
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  } catch {
    // Ignore storage errors
  }
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  loadFromStorage: () => {
    const storedUser = getStoredUser()
    const storedToken = getStoredToken()
    if (storedUser && storedToken) {
      set({ user: storedUser, token: storedToken, isAuthenticated: true })
    }
  },

  login: async (email: string, password: string) => {
    try {
      console.log('Making login API call to /api/auth/login')
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      console.log('Login response status:', response.status)

      const data = await response.json()
      console.log('Login response data:', { success: data.success, hasToken: !!data.token })

      if (data.success && data.token && data.user) {
        // Store token and user
        saveStoredToken(data.token)
        saveStoredUser(data.user)
        
        set({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
        })
        
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Login failed' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      console.log('Making register API call to /api/auth/register')
      
      // Split name into firstName and lastName
      const nameParts = name.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || undefined

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
        }),
      })

      console.log('Register response status:', response.status)

      const data = await response.json()
      console.log('Register response data:', { success: data.success, hasToken: !!data.token })

      if (data.success && data.token && data.user) {
        // Store token and user
        saveStoredToken(data.token)
        saveStoredUser(data.user)
        
        set({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
        })
        
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Registration failed' }
      }
    } catch (error) {
      console.error('Register error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  },

  logout: () => {
    saveStoredUser(null)
    saveStoredToken(null)
    set({ user: null, token: null, isAuthenticated: false })
  },

  updateProfile: (updates: Partial<User>) => {
    const currentUser = get().user
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates }
      set({ user: updatedUser })
      saveStoredUser(updatedUser)
    }
  },
}))
