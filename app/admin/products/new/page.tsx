"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useProductStore } from "@/store/products"
import { Product } from "@/data/products"
import AdminLayout from "@/components/AdminLayout"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

const categories = [
  "Electronics",
  "Fashion",
  "Home & Living",
  "Sports",
  "Beauty",
  "Books",
]

export default function ProductFormPage({ params }: { params: { id?: string } }) {
  const router = useRouter()
  const isEdit = !!params?.id
  const productId = params?.id ? parseInt(params.id) : null
  const product = useProductStore((state) =>
    productId ? state.getProductById(productId) : undefined
  )
  const addProduct = useProductStore((state) => state.addProduct)
  const updateProduct = useProductStore((state) => state.updateProduct)
  const loadProducts = useProductStore((state) => state.loadProducts)

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    originalPrice: "",
    category: categories[0],
    image: "",
    featured: false,
    discount: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadProducts()
    if (isEdit && product) {
      setFormData({
        name: product.name,
        brand: product.brand,
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || "",
        category: product.category,
        image: product.image,
        featured: product.featured || false,
        discount: product.discount?.toString() || "",
      })
    }
  }, [isEdit, product, loadProducts])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required"
    }

    if (!formData.brand.trim()) {
      newErrors.brand = "Brand is required"
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    if (!formData.image.trim()) {
      newErrors.image = "Image URL is required"
    }

    if (formData.originalPrice && parseFloat(formData.originalPrice) <= parseFloat(formData.price)) {
      newErrors.originalPrice = "Original price must be greater than price"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setSaving(true)

    try {
      const productData = {
        name: formData.name.trim(),
        brand: formData.brand.trim(),
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        category: formData.category,
        image: formData.image.trim(),
        featured: formData.featured,
        discount: formData.discount ? parseInt(formData.discount) : undefined,
      }

      if (isEdit && productId) {
        updateProduct(productId, productData)
      } else {
        addProduct(productData)
      }

      router.push("/admin/products")
    } catch (error) {
      console.error("Failed to save product:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEdit ? "Update product information" : "Create a new product"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 md:p-8 space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter product name"
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Brand */}
          <div className="space-y-2">
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
              Brand <span className="text-red-500">*</span>
            </label>
            <input
              id="brand"
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.brand ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter brand name"
            />
            {errors.brand && <p className="text-sm text-red-600">{errors.brand}</p>}
          </div>

          {/* Price and Original Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.price ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="0.00"
              />
              {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">
                Original Price ($)
              </label>
              <input
                id="originalPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.originalPrice ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="0.00"
              />
              {errors.originalPrice && <p className="text-sm text-red-600">{errors.originalPrice}</p>}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.category ? "border-red-300" : "border-gray-300"
              }`}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Image URL <span className="text-red-500">*</span>
            </label>
            <input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.image ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="https://example.com/image.jpg"
            />
            {errors.image && <p className="text-sm text-red-600">{errors.image}</p>}
            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                  }}
                />
              </div>
            )}
          </div>

          {/* Featured and Discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Featured Product</span>
              </label>
            </div>

            <div className="space-y-2">
              <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
                Discount (%)
              </label>
              <input
                id="discount"
                type="number"
                min="0"
                max="100"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <Link
              href="/admin/products"
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

