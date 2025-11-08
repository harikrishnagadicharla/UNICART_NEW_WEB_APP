"use client"

import { Product } from "@/data/products"
import { useCartStore } from "@/store/cart"
import { useWishlistStore } from "@/store/wishlist"
import { useAuthStore } from "@/store/auth"
import { Star, ShoppingCart, Heart, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
}

export default function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart)
  const addToWishlist = useWishlistStore((state) => state.addToWishlist)
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist)
  const isInWishlist = useWishlistStore((state) => state.isInWishlist)
  const user = useAuthStore((state) => state.user)
  const [copied, setCopied] = useState(false)

  // Check if product is in wishlist using originalId if available
  const isWishlisted = product.originalId 
    ? isInWishlist(product.originalId)
    : isInWishlist(product.id)
  const isAdmin = user?.role === 'ADMIN'
  const canWishlist = user && !isAdmin

  const handleAddToCart = async () => {
    // Use originalId (database ID) if available
    // If originalId is not available, we can't add to cart (product not from API)
    if (!product.originalId) {
      console.error('Product missing originalId:', product)
      alert('Unable to add product to cart. Product ID is missing.')
      return
    }

    const productId = product.originalId
    
    console.log('handleAddToCart called for product:', {
      name: product.name,
      id: product.id,
      originalId: product.originalId,
      productId
    })

    try {
      await addToCart(productId, 1)
      // Success - cart will be updated automatically
    } catch (error) {
      console.error('Error adding to cart:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to add to cart'
      
      // Show user-friendly error message
      if (errorMessage.includes('login') || errorMessage.includes('Login')) {
        if (confirm('Please login to add items to cart. Would you like to go to the login page?')) {
          window.location.href = '/auth/login'
        }
      } else {
        alert(errorMessage)
      }
    }
  }

  const handleWishlistToggle = async () => {
    if (!canWishlist) return
    
    // Use originalId (database ID) if available
    if (!product.originalId) {
      console.error('Product missing originalId:', product)
      alert('Unable to add product to wishlist. Product ID is missing.')
      return
    }

    const productId = product.originalId
    
    try {
      if (isWishlisted) {
        await removeFromWishlist(productId)
      } else {
        await addToWishlist(productId)
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to update wishlist'
      
      if (errorMessage.includes('login') || errorMessage.includes('Login')) {
        if (confirm('Please login to manage your wishlist. Would you like to go to the login page?')) {
          window.location.href = '/auth/login'
        }
      } else {
        alert(errorMessage)
      }
    }
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/products/${product.id}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
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

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 flex gap-6">
        <Link href={`/products/${product.id}`} className="relative w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="192px"
          />
          {product.featured && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
              Featured
            </div>
          )}
          {product.discount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              -{product.discount}%
            </div>
          )}
        </Link>
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <p className="text-sm text-gray-500 font-medium">{product.brand}</p>
            <Link href={`/products/${product.id}`}>
              <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">{product.name}</h3>
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">({product.reviews})</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-gray-900">${product.price}</span>
              {product.originalPrice && (
                <span className="text-base text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddToCart}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
            {canWishlist && (
              <button
                onClick={handleWishlistToggle}
                className={`p-2 rounded-lg transition-colors ${
                  isWishlisted
                    ? "bg-red-50 text-red-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
              </button>
            )}
            <button
              onClick={handleShare}
              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              title="Share product"
            >
              <Share2 className="h-5 w-5" />
            </button>
            {copied && (
              <span className="text-sm text-green-600 font-medium">Copied!</span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group">
      <Link href={`/products/${product.id}`} className="relative aspect-[3/4] overflow-hidden bg-gray-100 block">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {product.featured && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
            Featured
          </div>
        )}
        {product.discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
            -{product.discount}%
          </div>
        )}
        {canWishlist && (
          <button
            onClick={(e) => {
              e.preventDefault()
              handleWishlistToggle()
            }}
            className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
              isWishlisted
                ? "bg-red-500 text-white"
                : "bg-white/90 text-gray-600 hover:bg-white"
            }`}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
          </button>
        )}
      </Link>
      <div className="p-4 space-y-3">
        <p className="text-sm text-gray-500 font-medium">{product.brand}</p>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Add to Cart
          </button>
          {canWishlist && (
            <button
              onClick={handleWishlistToggle}
              className={`p-2 rounded-lg transition-colors ${
                isWishlisted
                  ? "bg-red-50 text-red-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
            </button>
          )}
          <button
            onClick={handleShare}
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            title="Share product"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
        {copied && (
          <div className="text-sm text-green-600 font-medium text-center">Link copied!</div>
        )}
      </div>
    </div>
  )
}

