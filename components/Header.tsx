"use client"

import { Search, User, Heart, ShoppingCart, LogOut, Package, Settings, LayoutDashboard } from "lucide-react"
import { useCartStore } from "@/store/cart"
import { useAuthStore } from "@/store/auth"
import { useWishlistStore } from "@/store/wishlist"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"

export default function Header() {
  const cartItemsCount = useCartStore((state) => state.getTotalItems())
  const fetchCart = useCartStore((state) => state.fetchCart)
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)
  const loadAuthFromStorage = useAuthStore((state) => state.loadFromStorage)
  const wishlistCount = useWishlistStore((state) => state.getWishlistCount())
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist)
  
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load auth from storage on mount
  useEffect(() => {
    loadAuthFromStorage()
  }, [loadAuthFromStorage])

  // Fetch wishlist from API when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Double-check token exists before fetching wishlist
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('unicart-auth-token') 
        : null
      
      if (token) {
        fetchWishlist()
      }
    }
  }, [isAuthenticated, fetchWishlist])

  // Fetch cart from API when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Double-check token exists before fetching cart
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('unicart-auth-token') 
        : null
      
      if (token) {
        fetchCart()
      }
    }
  }, [isAuthenticated, fetchCart])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setShowProfileDropdown(false)
  }

  const isAdmin = user?.role === 'ADMIN'

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-blue-600">UniCart</div>
            <span className="text-sm text-gray-500 font-medium">by Aishani</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Admin: Only Profile */}
                {isAdmin ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <User className="h-5 w-5" />
                              <span className="hidden lg:inline">{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}</span>
                    </button>
                    {showProfileDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 transition-colors font-semibold"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                        <Link
                          href="/account"
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                          <span>My Profile</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Customer: Profile, Wishlist, Cart */}
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                        className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        <User className="h-5 w-5" />
                                <span className="hidden lg:inline">{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || "Profile"}</span>
                      </button>
                      {showProfileDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                          <Link
                            href="/account"
                            onClick={() => setShowProfileDropdown(false)}
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Settings className="h-4 w-4" />
                            <span>My Profile</span>
                          </Link>
                          <Link
                            href="/orders"
                            onClick={() => setShowProfileDropdown(false)}
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Package className="h-4 w-4" />
                            <span>My Orders</span>
                          </Link>
                          <Link
                            href="/wishlist"
                            onClick={() => setShowProfileDropdown(false)}
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Heart className="h-4 w-4" />
                            <span>Wishlist</span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      )}
                    </div>
                    <Link
                      href="/wishlist"
                      className="relative flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <Heart className="h-5 w-5" />
                      <span className="hidden lg:inline">Wishlist</span>
                      {wishlistCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      href="/cart"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span className="hidden sm:inline">Cart</span>
                      <span className="bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs font-semibold">
                        {cartItemsCount}
                      </span>
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                {/* Guest: Account (Login) */}
                <Link
                  href="/auth/login"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden lg:inline">Account</span>
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Heart className="h-5 w-5" />
                  <span className="hidden lg:inline">Wishlist</span>
                </Link>
                <Link
                  href="/cart"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="hidden sm:inline">Cart</span>
                  <span className="bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs font-semibold">
                    {cartItemsCount}
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
