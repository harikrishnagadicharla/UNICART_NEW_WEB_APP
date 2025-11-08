"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useCartStore } from "@/store/cart"
import { useAuthStore } from "@/store/auth"
import ProtectedRoute from "@/components/ProtectedRoute"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Banner from "@/components/Banner"
import { ArrowLeft, Truck, Check, Lock, Shield } from "lucide-react"

interface FormErrors {
  firstName?: string
  lastName?: string
  streetAddress?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)
  const fetchCart = useCartStore((state) => state.fetchCart)
  const [mounted, setMounted] = useState(false)

  // Form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [streetAddress, setStreetAddress] = useState("")
  const [apartment, setApartment] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [country, setCountry] = useState("United States")
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fix hydration issues and fetch cart
  useEffect(() => {
    setMounted(true)
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('unicart-auth-token') 
      : null
    if (token) {
      fetchCart()
    }
  }, [fetchCart])

  // Redirect if cart is empty
  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push("/cart")
    }
  }, [mounted, items.length, router])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!streetAddress.trim()) {
      newErrors.streetAddress = "Street address is required"
    }

    if (!city.trim()) {
      newErrors.city = "City is required"
    }

    if (!state.trim()) {
      newErrors.state = "State is required"
    }

    if (!zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required"
    } else if (!/^\d{5}(-\d{4})?$/.test(zipCode)) {
      newErrors.zipCode = "Please enter a valid ZIP code"
    }

    if (!country.trim()) {
      newErrors.country = "Country is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call to save shipping info
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Navigate to payment page
    setIsSubmitting(false)
    router.push("/payment")
  }

  const subtotal = getTotalPrice()
  const shipping = subtotal >= 50 ? 0 : 9.99
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Banner />
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-600">Loading checkout...</div>
        </div>
        <Footer />
      </div>
    )
  }

  if (items.length === 0) {
    return null
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Banner />
        <Header />
        
        <main className="flex-1 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back to Cart</span>
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Checkout
              </h1>
              <p className="text-gray-600 text-lg">
                Complete your order securely
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Shipping Form - Left Column */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                  {/* Section Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Truck className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Shipping Information
                    </h2>
                  </div>

                  {/* Shipping Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* First Name and Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          value={firstName}
                          onChange={(e) => {
                            setFirstName(e.target.value)
                            if (errors.firstName) {
                              setErrors({ ...errors, firstName: undefined })
                            }
                          }}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.firstName
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          }`}
                          placeholder="John"
                        />
                        {errors.firstName && (
                          <p className="text-sm text-red-600">{errors.firstName}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          value={lastName}
                          onChange={(e) => {
                            setLastName(e.target.value)
                            if (errors.lastName) {
                              setErrors({ ...errors, lastName: undefined })
                            }
                          }}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.lastName
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          }`}
                          placeholder="Doe"
                        />
                        {errors.lastName && (
                          <p className="text-sm text-red-600">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    {/* Street Address */}
                    <div className="space-y-2">
                      <label
                        htmlFor="streetAddress"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="streetAddress"
                        type="text"
                        value={streetAddress}
                        onChange={(e) => {
                          setStreetAddress(e.target.value)
                          if (errors.streetAddress) {
                            setErrors({ ...errors, streetAddress: undefined })
                          }
                        }}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.streetAddress
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="123 Main Street"
                      />
                      {errors.streetAddress && (
                        <p className="text-sm text-red-600">{errors.streetAddress}</p>
                      )}
                    </div>

                    {/* Apartment (Optional) */}
                    <div className="space-y-2">
                      <label
                        htmlFor="apartment"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Apartment, suite, etc. <span className="text-gray-500">(optional)</span>
                      </label>
                      <input
                        id="apartment"
                        type="text"
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Apt 4B"
                      />
                    </div>

                    {/* City, State, ZIP */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2 sm:col-span-1">
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-gray-700"
                        >
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="city"
                          type="text"
                          value={city}
                          onChange={(e) => {
                            setCity(e.target.value)
                            if (errors.city) {
                              setErrors({ ...errors, city: undefined })
                            }
                          }}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.city
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          }`}
                          placeholder="New York"
                        />
                        {errors.city && (
                          <p className="text-sm text-red-600">{errors.city}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="state"
                          className="block text-sm font-medium text-gray-700"
                        >
                          State <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="state"
                          type="text"
                          value={state}
                          onChange={(e) => {
                            setState(e.target.value)
                            if (errors.state) {
                              setErrors({ ...errors, state: undefined })
                            }
                          }}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.state
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          }`}
                          placeholder="NY"
                        />
                        {errors.state && (
                          <p className="text-sm text-red-600">{errors.state}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="zipCode"
                          className="block text-sm font-medium text-gray-700"
                        >
                          ZIP Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="zipCode"
                          type="text"
                          value={zipCode}
                          onChange={(e) => {
                            setZipCode(e.target.value)
                            if (errors.zipCode) {
                              setErrors({ ...errors, zipCode: undefined })
                            }
                          }}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.zipCode
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          }`}
                          placeholder="10001"
                        />
                        {errors.zipCode && (
                          <p className="text-sm text-red-600">{errors.zipCode}</p>
                        )}
                      </div>
                    </div>

                    {/* Country */}
                    <div className="space-y-2">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="country"
                        value={country}
                        onChange={(e) => {
                          setCountry(e.target.value)
                          if (errors.country) {
                            setErrors({ ...errors, country: undefined })
                          }
                        }}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.country
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.country && (
                        <p className="text-sm text-red-600">{errors.country}</p>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              {/* Order Summary - Right Column */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-md p-6 md:p-8 lg:sticky lg:top-24 h-fit">
                  {/* Section Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Order Summary
                    </h2>
                  </div>

                  {/* Product List */}
                  <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={item.product.image || '/placeholder-image.jpg'}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cost Breakdown */}
                  <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex justify-between text-gray-700">
                      <span>
                        Subtotal ({items.length} {items.length === 1 ? "item" : "items"})
                      </span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping</span>
                      <span className={`font-semibold ${shipping === 0 ? "text-green-600" : ""}`}>
                        {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Tax</span>
                      <span className="font-semibold">${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  {/* Security Message */}
                  <div className="flex items-start gap-3 mb-6 p-4 bg-blue-50 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Secure checkout with SSL encryption
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        Your payment information is secure
                      </p>
                    </div>
                  </div>

                  {/* Continue to Payment Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="h-5 w-5" />
                        Continue to Payment
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
