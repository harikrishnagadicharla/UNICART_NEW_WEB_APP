"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth"
import { formatDate } from "@/lib/formatters"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Banner from "@/components/Banner"
import { Save, User, Mail, MapPin } from "lucide-react"

export default function AccountPage() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const updateProfile = useAuthStore((state) => state.updateProfile)
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage)
  
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [mounted, setMounted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadFromStorage()
  }, [loadFromStorage])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [mounted, isAuthenticated, router])

  useEffect(() => {
    if (user) {
      setName(user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email)
      setEmail(user.email)
      setAddress(user.phone || "")
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)

    try {
      updateProfile({
        firstName: name.split(' ')[0] || '',
        lastName: name.split(' ').slice(1).join(' ') || '',
        phone: address || null,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error("Failed to update profile:", error)
    } finally {
      setSaving(false)
    }
  }

  if (!mounted || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Banner />
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Banner />
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account information and preferences</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 space-y-6">
            {/* Account Info */}
            <div className="border-b border-gray-200 pb-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-semibold text-gray-900 capitalize">{user.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-semibold text-gray-900">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
                
                {/* Name Field */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Email Field (Read-only) */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>

                {/* Address Field */}
                <div className="space-y-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                    <textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={4}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Enter your address"
                    />
                  </div>
                </div>
              </div>

              {/* Success Message */}
              {saved && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">Profile updated successfully!</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-5 w-5" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

