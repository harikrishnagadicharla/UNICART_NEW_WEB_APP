"use client"

import { useEffect, useState } from "react"
import { useProductStore } from "@/store/products"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Edit, Trash2, Plus, Search } from "lucide-react"
import Image from "next/image"
import AdminLayout from "@/components/AdminLayout"

export default function AdminProductsPage() {
  const router = useRouter()
  const products = useProductStore((state) => state.products)
  const deleteProduct = useProductStore((state) => state.deleteProduct)
  const loadProducts = useProductStore((state) => state.loadProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id)
      setDeleteId(null)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">Manage your product catalog</p>
          </div>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add New Product
          </Link>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Image</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Name</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Category</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Price</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Brand</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-900">{product.name}</div>
                        {product.featured && (
                          <span className="text-xs text-blue-600 font-medium">Featured</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">{product.category}</td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-900">${product.price.toFixed(2)}</div>
                        {product.originalPrice && (
                          <div className="text-xs text-gray-500 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">{product.brand}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> of{" "}
            <span className="font-semibold text-gray-900">{products.length}</span> products
          </p>
        </div>
      </div>
    </AdminLayout>
  )
}

