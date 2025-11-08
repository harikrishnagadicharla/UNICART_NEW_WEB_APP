"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Laptop, Shirt, Home, Dumbbell, Sparkles, BookOpen, LucideIcon, ArrowLeft, Star } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Banner from "@/components/Banner"
import ProductCard from "@/components/ProductCard"

interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  image?: string | null
  icon?: string | null
  productCount: number
}

interface Product {
  id: string
  name: string
  slug: string
  brand?: string | null
  price: number
  comparePrice?: number | null
  image: string | null
  imageAlt?: string | null
  rating: number
  reviewsCount: number
  isFeatured: boolean
}

// Icon mapping - maps icon string from database to Lucide icon component
const iconMap: Record<string, LucideIcon> = {
  '📱': Laptop,
  '👕': Shirt,
  '🏠': Home,
  '⚽': Dumbbell,
  '💄': Sparkles,
  '📚': BookOpen,
}

// Color classes array for consistent styling
const colorClasses = [
  "bg-blue-100 text-blue-600",
  "bg-pink-100 text-pink-600",
  "bg-green-100 text-green-600",
  "bg-orange-100 text-orange-600",
  "bg-purple-100 text-purple-600",
  "bg-yellow-100 text-yellow-600",
]

export default function CategoryPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategoryAndProducts() {
      if (!slug) return

      try {
        setLoading(true)
        setError(null)

        // Fetch category details
        const categoriesResponse = await fetch('/api/categories')
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories')
        }
        const categoriesData = await categoriesResponse.json()
        
        if (categoriesData.success && categoriesData.categories) {
          const foundCategory = categoriesData.categories.find(
            (cat: Category) => cat.slug === slug
          )
          
          if (!foundCategory) {
            throw new Error('Category not found')
          }
          
          setCategory(foundCategory)
        } else {
          throw new Error('Invalid categories response')
        }

        // Fetch products for this category
        const productsResponse = await fetch(`/api/products?category=${encodeURIComponent(slug)}`)
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products')
        }
        const productsData = await productsResponse.json()
        
        if (productsData.success && productsData.products) {
          setProducts(productsData.products)
        } else {
          throw new Error('Invalid products response')
        }
      } catch (err) {
        console.error('Error fetching category data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load category')
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryAndProducts()
  }, [slug])

  const getIcon = (iconString: string | null | undefined): LucideIcon => {
    if (iconString && iconMap[iconString]) {
      return iconMap[iconString]
    }
    return Laptop // Default icon
  }

  const getColorClass = (index: number): string => {
    return colorClasses[index % colorClasses.length]
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Banner />
        <Header />
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="text-gray-600">Loading category...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Banner />
        <Header />
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error || 'Category not found'}</p>
            <Link
              href="/categories"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Categories
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const Icon = getIcon(category.icon)
  const colorClass = colorClasses[0] // Use first color for category header

  return (
    <div className="min-h-screen flex flex-col">
      <Banner />
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Link */}
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Categories</span>
          </Link>

          {/* Category Header */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className={`${colorClass} p-6 rounded-full`}>
                <Icon className="h-12 w-12" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {category.name}
                </h1>
                {category.description && (
                  <p className="text-gray-600 text-lg mb-4">
                    {category.description}
                  </p>
                )}
                <p className="text-gray-500">
                  {category.productCount} {category.productCount === 1 ? 'product' : 'products'} available
                </p>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">
                No products found in this category
              </p>
              <Link
                href="/categories"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Browse other categories
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Products ({products.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => {
                  // Convert string ID to number for ProductCard compatibility
                  // Use a simple hash function to convert string ID to number
                  const numericId = product.id.split('').reduce((acc, char) => {
                    return ((acc << 5) - acc) + char.charCodeAt(0) | 0
                  }, 0)
                  
                  // Calculate discount if comparePrice exists
                  const discount = product.comparePrice && product.comparePrice > product.price
                    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
                    : undefined

                  return (
                    <ProductCard
                      key={product.id}
                      product={{
                        id: Math.abs(numericId), // Ensure positive number
                        name: product.name,
                        brand: product.brand || '',
                        price: product.price,
                        originalPrice: product.comparePrice || undefined,
                        image: product.image || '/placeholder-image.jpg',
                        rating: product.rating,
                        reviews: product.reviewsCount,
                        category: category.name,
                        featured: product.isFeatured,
                        discount,
                        originalId: product.id, // Store original database ID
                      }}
                    />
                  )
                })}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

