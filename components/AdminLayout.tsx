"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/store/auth"
import Link from "next/link"
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  FolderTree,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadFromStorage()
  }, [loadFromStorage])

  useEffect(() => {
    if (mounted && (!user || user.email !== 'admin@example.com')) {
      router.push('/auth/login')
    }
  }, [mounted, user, router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (!mounted || !user || user.email !== 'admin@example.com') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Package, label: 'Products', href: '/admin/products' },
    { icon: ShoppingBag, label: 'Orders', href: '/admin/orders' },
    { icon: Users, label: 'Customers', href: '/admin/customers' },
    { icon: FolderTree, label: 'Categories', href: '/admin/categories' },
    { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-blue-600">UniCart</div>
            <span className="text-xs text-gray-500 font-medium">Admin</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                Admin
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

