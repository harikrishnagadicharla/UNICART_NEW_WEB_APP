"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadFromStorage()
  }, [loadFromStorage])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [mounted, isAuthenticated, router])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

