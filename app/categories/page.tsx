"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Laptop, Shirt, Home, Dumbbell, Sparkles, BookOpen, LucideIcon } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Banner from "@/components/Banner"

interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  image?: string | null
  icon?: string | null
  productCount: number
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

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true)
        const response = await fetch('/api/categories')
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }

        const data = await response.json()
        
        if (data.success && data.categories) {
          setCategories(data.categories)
        } else {
          throw new Error('Invalid response format')
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError(err instanceof Error ? err.message : 'Failed to load categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

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
          <div className="text-gray-600">Loading categories...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Banner />
        <Header />
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="text-red-600">Error: {error}</div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Banner />
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h1>
            <p className="text-gray-600 text-lg">
              Explore our wide range of products
            </p>
          </div>

          {/* Categories Grid */}
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No categories available</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
              {categories.map((category, index) => {
                const Icon = getIcon(category.icon)
                const colorClass = getColorClass(index)
                
                return (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="flex flex-col items-center p-6 rounded-xl border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className={`${colorClass} p-4 rounded-full mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 text-center mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
                    </p>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

