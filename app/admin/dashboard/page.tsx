"use client"

import { useEffect } from "react"
import { useProductStore } from "@/store/products"
import { Package, ShoppingBag, DollarSign, AlertTriangle, Plus, Edit, Eye } from "lucide-react"
import Link from "next/link"
import AdminLayout from "@/components/AdminLayout"

export default function AdminDashboardPage() {
  const products = useProductStore((state) => state.products)
  const loadProducts = useProductStore((state) => state.loadProducts)

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  // Calculate metrics
  const totalProducts = products.length
  const totalOrders = 0 // Placeholder
  const totalRevenue = 0 // Placeholder
  const lowStockItems = products.filter(p => {
    // Mock low stock check - in real app, check inventory
    return false
  }).length

  const performanceCards = [
    {
      title: 'Total Products',
      value: totalProducts.toString(),
      change: '+5%',
      changeType: 'positive' as const,
      icon: Package,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Total Orders',
      value: totalOrders.toString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: ShoppingBag,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      change: '+8%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Low Stock Alerts',
      value: lowStockItems.toString(),
      change: 'Action needed',
      changeType: 'warning' as const,
      icon: AlertTriangle,
      color: 'bg-orange-100 text-orange-600',
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceCards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.title} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${card.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      card.changeType === 'positive'
                        ? 'text-green-600'
                        : card.changeType === 'warning'
                        ? 'text-orange-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {card.change}
                  </span>
                </div>
                <h3 className="text-sm text-gray-600 mb-1">{card.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add New Product
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              <Edit className="h-5 w-5" />
              Manage Products
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              <Eye className="h-5 w-5" />
              View Orders
            </Link>
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Products</h2>
            <Link
              href="/admin/products"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{product.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{product.category}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

