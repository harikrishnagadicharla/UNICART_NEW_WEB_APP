"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface FilterSidebarProps {
  categories: string[]
  brands: string[]
  selectedCategory: string | null
  selectedBrand: string | null
  priceRange: [number, number]
  onCategoryChange: (category: string | null) => void
  onBrandChange: (brand: string | null) => void
  onPriceRangeChange: (range: [number, number]) => void
  onClearFilters: () => void
}

export default function FilterSidebar({
  categories,
  brands,
  selectedCategory,
  selectedBrand,
  priceRange,
  onCategoryChange,
  onBrandChange,
  onPriceRangeChange,
  onClearFilters,
}: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
        >
          {isOpen ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "block" : "hidden"
        } lg:block bg-white rounded-xl shadow-md p-6 space-y-8 lg:sticky lg:top-24 h-fit`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear All
          </button>
        </div>

        {/* Free Shipping Banner */}
        <div className="bg-blue-600 text-white p-4 rounded-lg">
          <p className="text-sm font-medium text-center">
            🚚 Free shipping on orders over $100
          </p>
        </div>

        {/* Category Filter */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Category</h3>
          <div className="space-y-2">
            <button
              onClick={() => onCategoryChange(null)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === null
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Price Range</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0] || ""}
                onChange={(e) =>
                  onPriceRangeChange([
                    Number(e.target.value) || 0,
                    priceRange[1],
                  ])
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1] || ""}
                onChange={(e) =>
                  onPriceRangeChange([
                    priceRange[0],
                    Number(e.target.value) || Infinity,
                  ])
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Brand Filter */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Brand</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <button
              onClick={() => onBrandChange(null)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                selectedBrand === null
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              All Brands
            </button>
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => onBrandChange(brand)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  selectedBrand === brand
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}

