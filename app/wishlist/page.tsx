"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useWishlistStore } from "@/store/wishlist"
import { useAuthStore } from "@/store/auth"
import { useCartStore } from "@/store/cart"
import ProtectedRoute from "@/components/ProtectedRoute"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Banner from "@/components/Banner"
import ProductCard from "@/components/ProductCard"
import { Product } from "@/data/products"
import { Heart, Trash2, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function WishlistPage() {
  return (
    <ProtectedRoute>
      <WishlistContent />
    </ProtectedRoute>
  )
}

function WishlistContent() {
  const router = useRouter()
  const items = useWishlistStore((state) => state.items)
  const clearWishlist = useWishlistStore((state) => state.clearWishlist)
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist)
  const addToCart = useCartStore((state) => state.addToCart)
  const user = useAuthStore((state) => state.user)
  const isLoading = useWishlistStore((state) => state.isLoading)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    console.log('💝 Fetching wishlist data...')
    fetchWishlist()
  }, [fetchWishlist])

  // Redirect admin users
  useEffect(() => {
    if (mounted && user?.role === 'ADMIN') {
      router.push('/admin/dashboard')
    }
  }, [mounted, user, router])

  const handleClearAll = async () => {
    if (confirm("Are you sure you want to clear your wishlist?")) {
      try {
        await clearWishlist()
      } catch (error) {
        console.error('Error clearing wishlist:', error)
        alert('Failed to clear wishlist. Please try again.')
      }
    }
  }

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1)
    } catch (error) {
      console.error('Error adding to cart:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to add to cart'
      
      if (errorMessage.includes('login') || errorMessage.includes('Login')) {
        if (confirm('Please login to add items to cart. Would you like to go to the login page?')) {
          window.location.href = '/auth/login'
        }
      } else {
        alert(errorMessage)
      }
    }
  }

  // Map wishlist items to Product format for ProductCard
  const mappedProducts: Product[] = items.map((item) => {
    // Convert string ID to number for ProductCard compatibility
    const numericId = item.product.id.split('').reduce((acc: number, char: string) => {
      return ((acc << 5) - acc) + char.charCodeAt(0) | 0
    }, 0)

    // Calculate discount if comparePrice exists
    const discount = item.product.comparePrice && item.product.comparePrice > item.product.price
      ? Math.round(((item.product.comparePrice - item.product.price) / item.product.comparePrice) * 100)
      : undefined

    return {
      id: Math.abs(numericId),
      name: item.product.name,
      brand: item.product.brand || '',
      price: item.product.price,
      originalPrice: item.product.comparePrice || undefined,
      image: item.product.image || '/placeholder-image.jpg',
      rating: item.product.rating,
      reviews: item.product.reviewsCount,
      category: item.product.category.name,
      featured: item.product.isFeatured,
      discount,
      originalId: item.product.id, // Store original database ID
    }
  })

  if (!mounted || isLoading || user?.role === 'ADMIN') {
    return (
      <div className="min-h-screen flex flex-col">
        <Banner />
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Banner />
      <Header />
      
      <main className="flex-1 bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  My Wishlist
                </h1>
                <p className="text-gray-600">
                  {items.length} {items.length === 1 ? "item" : "items"} saved
                </p>
              </div>
              {items.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="font-medium">Clear All</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {items.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Start adding items you love to your wishlist!
              </p>
              <Link
                href="/products"
                className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mappedProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode="grid" />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
