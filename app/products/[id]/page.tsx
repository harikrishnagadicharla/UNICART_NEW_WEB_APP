"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useProductStore } from "@/store/products"
import { useCartStore } from "@/store/cart"
import { useWishlistStore } from "@/store/wishlist"
import { useAuthStore } from "@/store/auth"
import { Star, ShoppingCart, Heart, Share2, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Banner from "@/components/Banner"

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params?.id ? parseInt(params.id as string) : null
  const product = useProductStore((state) =>
    productId ? state.getProductById(productId) : undefined
  )
  const loadProducts = useProductStore((state) => state.loadProducts)
  const addToCart = useCartStore((state) => state.addToCart)
  const addToWishlist = useWishlistStore((state) => state.addToWishlist)
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist)
  const isInWishlist = useWishlistStore((state) => state.isInWishlist)
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist)
  const user = useAuthStore((state) => state.user)
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    setMounted(true)
    loadProducts()
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('unicart-auth-token') 
      : null
    if (token) {
      fetchWishlist()
    }
  }, [loadProducts, fetchWishlist])

  if (!mounted) {
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

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Banner />
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h1>
            <Link href="/products" className="text-blue-600 hover:text-blue-700">
              Back to Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const isWishlisted = isInWishlist(product.id)
  const isAdmin = user?.role === 'ADMIN'
  const canWishlist = user && !isAdmin

  const handleAddToCart = async () => {
    if (!product.originalId) {
      console.error('Product missing originalId:', product)
      alert('Unable to add product to cart. Product ID is missing.')
      return
    }
    
    try {
      await addToCart(product.originalId, quantity)
    } catch (error) {
      console.error('Error adding to cart:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to add to cart'
      alert(errorMessage)
    }
  }

  const handleWishlistToggle = async () => {
    if (!canWishlist) return
    
    if (!product.originalId) {
      console.error('Product missing originalId:', product)
      alert('Unable to add product to wishlist. Product ID is missing.')
      return
    }
    
    try {
      if (isWishlisted) {
        await removeFromWishlist(product.originalId)
      } else {
        await addToWishlist(product.originalId)
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to update wishlist'
      alert(errorMessage)
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Banner />
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-blue-600 transition-colors">Products</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>

          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                  {product.featured && (
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold">
                      Featured
                    </div>
                  )}
                  {product.discount && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold">
                      -{product.discount}%
                    </div>
                  )}
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-2">{product.brand}</p>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {product.name}
                  </h1>
                  
                  {/* Ratings */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-2xl text-gray-500 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    Discover the perfect {product.name} from {product.brand}. This premium product combines quality craftsmanship with modern design, perfect for your needs.
                  </p>
                </div>

                {/* Quantity and Actions */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                      Quantity:
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        -
                      </button>
                      <input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </button>
                    {canWishlist && (
                      <button
                        onClick={handleWishlistToggle}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                          isWishlisted
                            ? "bg-red-50 text-red-600 border-2 border-red-600 hover:bg-red-100"
                            : "bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200"
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
                        {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                      </button>
                    )}
                    <button
                      onClick={handleShare}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Share2 className="h-5 w-5" />
                      Share
                    </button>
                  </div>
                  {copied && (
                    <div className="text-sm text-green-600 font-medium text-center">
                      Product link copied to clipboard!
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Category:</span>
                    <span className="text-sm text-gray-600">{product.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Brand:</span>
                    <span className="text-sm text-gray-600">{product.brand}</span>
                  </div>
                  {product.featured && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Status:</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        Featured Product
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

