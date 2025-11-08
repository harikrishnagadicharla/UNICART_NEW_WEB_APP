"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Grid, List } from "lucide-react"
import FilterSidebar from "@/components/FilterSidebar"
import ProductCard from "@/components/ProductCard"
import { Product } from "@/data/products"

type SortOption = "featured" | "price-low" | "price-high" | "rating"
type ViewMode = "grid" | "list"

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

export default function ProductsContent() {
  const searchParams = useSearchParams()
  
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categorySlugMap, setCategorySlugMap] = useState<Record<string, string>>({})
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category") || null
  )
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    searchParams.get("brand") || null
  )
  const [priceRange, setPriceRange] = useState<[number, number]>([0, Infinity])
  const [sortBy, setSortBy] = useState<SortOption>("featured")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  // Fetch categories to build name-to-slug mapping
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.categories) {
            const map: Record<string, string> = {}
            data.categories.forEach((cat: { name: string; slug: string }) => {
              map[cat.name] = cat.slug
            })
            setCategorySlugMap(map)
          }
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
        // Continue without category mapping
      }
    }
    fetchCategories()
  }, [])

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true)
        setError(null)

        // Build query parameters
        const params = new URLSearchParams()
        
        // Convert category name to slug if needed
        if (selectedCategory) {
          const categorySlug = categorySlugMap[selectedCategory] || 
                              selectedCategory.toLowerCase().replace(/\s+/g, '-')
          params.append('category', categorySlug)
        }
        
        params.append('limit', '100') // Get more products for filtering

        const response = await fetch(`/api/products?${params.toString()}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch products')
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
              id: Math.abs(numericId), // Ensure positive number
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

          setProducts(mappedProducts)
        } else {
          throw new Error('Invalid response format')
        }
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err instanceof Error ? err.message : 'Failed to load products')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory, categorySlugMap]) // Refetch when category filter changes

  // Extract unique categories and brands from API data
  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category))).sort()
  }, [products])

  const brands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand).filter(Boolean))).sort()
  }, [products])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      // Search filter
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // Category filter (already filtered by API, but keep for client-side search)
      if (selectedCategory && product.category !== selectedCategory) {
        return false
      }

      // Brand filter
      if (selectedBrand && product.brand !== selectedBrand) {
        return false
      }

      // Price range filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false
      }

      return true
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "featured":
        default:
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return 0
      }
    })

    return filtered
  }, [products, searchQuery, selectedCategory, selectedBrand, priceRange, sortBy])

  const handleClearFilters = () => {
    setSelectedCategory(null)
    setSelectedBrand(null)
    setPriceRange([0, Infinity])
    setSearchQuery("")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading products...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">Products</span>
          </nav>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-2xl px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Results Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span>{" "}
                of <span className="font-semibold text-gray-900">{products.length}</span> results
              </p>
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Sort by: Price Low to High</option>
                <option value="price-high">Sort by: Price High to Low</option>
                <option value="rating">Sort by: Rating</option>
              </select>

              <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  aria-label="List view"
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar
              categories={categories}
              brands={brands}
              selectedCategory={selectedCategory}
              selectedBrand={selectedBrand}
              priceRange={priceRange}
              onCategoryChange={setSelectedCategory}
              onBrandChange={setSelectedBrand}
              onPriceRangeChange={setPriceRange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <p className="text-xl text-gray-600 mb-2">No products found</p>
                <p className="text-gray-500">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-6"
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
