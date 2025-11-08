"use client"

import { useCartStore } from "@/store/cart"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRight, Trash2, ShoppingBag } from "lucide-react"
import CartItemCard from "@/components/CartItemCard"
import OrderSummary from "@/components/OrderSummary"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Banner from "@/components/Banner"

export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const getTotalItems = useCartStore((state) => state.getTotalItems)
  const fetchCart = useCartStore((state) => state.fetchCart)
  const isLoading = useCartStore((state) => state.isLoading)
  const [mounted, setMounted] = useState(false)

  // Fix hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch cart from API when component mounts and user is authenticated
  useEffect(() => {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('unicart-auth-token') 
      : null
    
    if (token) {
      fetchCart()
    }
  }, [fetchCart])

  const handleClearCart = async () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      try {
        await clearCart()
      } catch (error) {
        console.error('Error clearing cart:', error)
        alert('Failed to clear cart. Please try again.')
      }
    }
  }

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Banner />
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-600">Loading cart...</div>
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
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900 font-medium">Shopping Cart</span>
            </nav>

            {/* Title and Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Shopping Cart
                </h1>
                <p className="text-gray-600">
                  {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"} in your cart
                </p>
              </div>
              <div className="flex items-center gap-4">
                {items.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="font-medium">Clear Cart</span>
                  </button>
                )}
                <Link
                  href="/products"
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {items.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Start adding items to your cart to see them here.
              </p>
              <Link
                href="/products"
                className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <CartItemCard key={item.id} item={item} />
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <OrderSummary />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

