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
import { ArrowLeft, CreditCard, Check, Lock, Shield } from "lucide-react"

interface FormErrors {
  cardNumber?: string
  nameOnCard?: string
  expiryDate?: string
  cvv?: string
}

export default function PaymentPage() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)
  const fetchCart = useCartStore((state) => state.fetchCart)
  const [mounted, setMounted] = useState(false)

  // Form state with demo values
  const [cardNumber, setCardNumber] = useState("1234 5678 9012 3456")
  const [nameOnCard, setNameOnCard] = useState("John Doe")
  const [expiryDate, setExpiryDate] = useState("12/25")
  const [cvv, setCvv] = useState("123")
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

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")
    // Add spaces every 4 digits
    return digits.match(/.{1,4}/g)?.join(" ") || digits
  }

  const formatExpiryDate = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")
    // Add slash after 2 digits
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`
    }
    return digits
  }

  const formatCVV = (value: string) => {
    // Only allow digits, max 4 characters
    return value.replace(/\D/g, "").slice(0, 4)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validate card number (should be 16 digits)
    const cardDigits = cardNumber.replace(/\D/g, "")
    if (!cardDigits || cardDigits.length !== 16) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number"
    }

    // Validate name on card
    if (!nameOnCard.trim()) {
      newErrors.nameOnCard = "Name on card is required"
    } else if (nameOnCard.trim().length < 2) {
      newErrors.nameOnCard = "Please enter a valid name"
    }

    // Validate expiry date (MM/YY format)
    const expiryDigits = expiryDate.replace(/\D/g, "")
    if (!expiryDigits || expiryDigits.length !== 4) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)"
    } else {
      const month = parseInt(expiryDigits.slice(0, 2))
      if (month < 1 || month > 12) {
        newErrors.expiryDate = "Please enter a valid month (01-12)"
      }
    }

    // Validate CVV (3-4 digits)
    const cvvDigits = cvv.replace(/\D/g, "")
    if (!cvvDigits || cvvDigits.length < 3) {
      newErrors.cvv = "Please enter a valid CVV"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setCardNumber(formatted)
    if (errors.cardNumber) {
      setErrors({ ...errors, cardNumber: undefined })
    }
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    setExpiryDate(formatted)
    if (errors.expiryDate) {
      setErrors({ ...errors, expiryDate: undefined })
    }
  }

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCVV(e.target.value)
    setCvv(formatted)
    if (errors.cvv) {
      setErrors({ ...errors, cvv: undefined })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In a real app, you would process payment via Stripe/PayPal API
    // For now, redirect to order confirmation
    setIsSubmitting(false)
    router.push("/order-confirmation")
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
          <div className="text-gray-600">Loading payment...</div>
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
                href="/checkout"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back to Checkout</span>
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Payment
              </h1>
              <p className="text-gray-600 text-lg">
                Complete your secure payment
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Payment Form - Left Column */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                  {/* Section Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Payment Information
                    </h2>
                  </div>

                  {/* Security Banner */}
                  <div className="flex items-start gap-3 mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <Lock className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900">
                        Your payment information is encrypted and secure
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        We use industry-standard SSL encryption to protect your data
                      </p>
                    </div>
                  </div>

                  {/* Payment Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Card Number */}
                    <div className="space-y-2">
                      <label
                        htmlFor="cardNumber"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Card Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="cardNumber"
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength={19} // 16 digits + 3 spaces
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.cardNumber
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="1234 5678 9012 3456"
                      />
                      {errors.cardNumber && (
                        <p className="text-sm text-red-600">{errors.cardNumber}</p>
                      )}
                    </div>

                    {/* Name on Card */}
                    <div className="space-y-2">
                      <label
                        htmlFor="nameOnCard"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name on Card <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="nameOnCard"
                        type="text"
                        value={nameOnCard}
                        onChange={(e) => {
                          setNameOnCard(e.target.value)
                          if (errors.nameOnCard) {
                            setErrors({ ...errors, nameOnCard: undefined })
                          }
                        }}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.nameOnCard
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.nameOnCard && (
                        <p className="text-sm text-red-600">{errors.nameOnCard}</p>
                      )}
                    </div>

                    {/* Expiry Date and CVV */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="expiryDate"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Expiry Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="expiryDate"
                          type="text"
                          value={expiryDate}
                          onChange={handleExpiryDateChange}
                          maxLength={5} // MM/YY
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.expiryDate
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          }`}
                          placeholder="MM/YY"
                        />
                        {errors.expiryDate && (
                          <p className="text-sm text-red-600">{errors.expiryDate}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="cvv"
                          className="block text-sm font-medium text-gray-700"
                        >
                          CVV <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="cvv"
                          type="text"
                          value={cvv}
                          onChange={handleCVVChange}
                          maxLength={4}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.cvv
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          }`}
                          placeholder="123"
                        />
                        {errors.cvv && (
                          <p className="text-sm text-red-600">{errors.cvv}</p>
                        )}
                      </div>
                    </div>

                    {/* Pay Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            <Lock className="h-5 w-5" />
                            Pay ${total.toFixed(2)}
                          </>
                        )}
                      </button>
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
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Protected by 256-bit SSL encryption
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        Your payment is secure and encrypted
                      </p>
                    </div>
                  </div>
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

