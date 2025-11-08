"use client"

import { useState, useEffect } from "react"
import ProductCard from "./ProductCard"
import { Product } from "@/data/products"

interface ApiProduct {
  id: string
  name: string
  slug: string
  brand?: string | null
  price: number
  comparePrice?: number | null
  image: string | null
  imageAlt?: string | null
  category: {
    id: string
    name: string
    slug: string
  }
  rating: number
  reviewsCount: number
  isFeatured: boolean
}

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const response = await fetch('/api/products?featured=true&limit=4')
        
        if (!response.ok) {
          throw new Error('Failed to fetch featured products')
        }

        const data = await response.json()
        
        if (data.success && data.products) {
          // Map API products to Product interface
          const mappedProducts: Product[] = data.products.map((apiProduct: ApiProduct) => {
            // Convert string ID to number for ProductCard compatibility
            const numericId = apiProduct.id.split('').reduce((acc: number, char: string) => {
              return ((acc << 5) - acc) + char.charCodeAt(0) | 0
            }, 0)

            // Calculate discount if comparePrice exists
            const discount = apiProduct.comparePrice && apiProduct.comparePrice > apiProduct.price
              ? Math.round(((apiProduct.comparePrice - apiProduct.price) / apiProduct.comparePrice) * 100)
              : undefined

            return {
              id: Math.abs(numericId),
              name: apiProduct.name,
              brand: apiProduct.brand || '',
              price: apiProduct.price,
              originalPrice: apiProduct.comparePrice || undefined,
              image: apiProduct.image || '/placeholder-image.jpg',
              rating: apiProduct.rating,
              reviews: apiProduct.reviewsCount,
              category: apiProduct.category.name,
              featured: apiProduct.isFeatured,
              discount,
              originalId: apiProduct.id, // Store original database ID
            }
          })

          setFeaturedProducts(mappedProducts)
        }
      } catch (error) {
        console.error('Error fetching featured products:', error)
        // Silently fail - don't break homepage
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  if (loading) {
    return (
      <section className="w-full py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 text-lg">
              Handpicked items just for you
            </p>
          </div>
          <div className="text-center text-gray-600">Loading featured products...</div>
        </div>
      </section>
    )
  }

  if (featuredProducts.length === 0) {
    return null // Don't show empty section
  }

  return (
    <section className="w-full py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-gray-600 text-lg">
            Handpicked items just for you
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} viewMode="grid" />
          ))}
        </div>
      </div>
    </section>
  )
}
