"use client"

import { useState } from "react"
import { useCartStore } from "@/store/cart"
import { Shield, Check } from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/store/auth"

export default function OrderSummary() {
  const items = useCartStore((state) => state.items)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)
  const [promoError, setPromoError] = useState("")

  const subtotal = getTotalPrice()
  const shipping = subtotal >= 50 ? 0 : 9.99
  const tax = subtotal * 0.08 // 8% tax
  const discount = appliedPromo ? subtotal * 0.1 : 0 // 10% discount
  const total = subtotal + shipping + tax - discount

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code")
      return
    }

    // Mock promo code validation
    const validPromoCodes = ["SAVE10", "WELCOME", "SUMMER"]
    if (validPromoCodes.includes(promoCode.toUpperCase())) {
      setAppliedPromo(promoCode.toUpperCase())
      setPromoError("")
    } else {
      setPromoError("Invalid promo code")
    }
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
    setPromoCode("")
    setPromoError("")
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8 lg:sticky lg:top-24 h-fit">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

      {/* Promo Code Section */}
      <div className="mb-6 space-y-3">
        {appliedPromo ? (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                            Promo code &quot;{appliedPromo}&quot; applied
              </span>
            </div>
            <button
              onClick={handleRemovePromo}
              className="text-sm text-green-700 hover:text-green-800 font-medium"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value)
                  setPromoError("")
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleApplyPromo}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                Apply
              </button>
            </div>
            {promoError && (
              <p className="text-sm text-red-600">{promoError}</p>
            )}
          </div>
        )}
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal ({items.length} {items.length === 1 ? "item" : "items"})</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Shipping</span>
          <span className={`font-semibold ${shipping === 0 ? "text-green-600" : ""}`}>
            {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        {appliedPromo && (
          <div className="flex justify-between text-green-600">
            <span>Discount ({appliedPromo})</span>
            <span className="font-semibold">-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-700">
          <span>Tax</span>
          <span className="font-semibold">${tax.toFixed(2)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
        <span className="text-xl font-bold text-gray-900">Total</span>
        <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
      </div>

      {/* Secure Checkout Message */}
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
        <Shield className="h-5 w-5 text-blue-600" />
        <span>Secure checkout. Your payment information is encrypted.</span>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {isAuthenticated ? (
          <Link
            href="/checkout"
            className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold text-center hover:bg-blue-700 transition-colors"
          >
            Proceed to Checkout
          </Link>
        ) : (
          <Link
            href="/auth/login"
            className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold text-center hover:bg-blue-700 transition-colors"
          >
            Sign In to Checkout
          </Link>
        )}
        <Link
          href="/products"
          className="block w-full px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold text-center hover:bg-blue-50 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

