"use client"

import { CartItem } from "@/store/cart"
import { useCartStore } from "@/store/cart"
import { Minus, Plus, Trash2, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CartItemCardProps {
  item: CartItem
}

export default function CartItemCard({ item }: CartItemCardProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeFromCart = useCartStore((state) => state.removeFromCart)

  const handleDecrease = async () => {
    if (item.quantity > 1) {
      try {
        await updateQuantity(item.productId, item.quantity - 1)
      } catch (error) {
        console.error('Error updating quantity:', error)
      }
    }
  }

  const handleIncrease = async () => {
    try {
      await updateQuantity(item.productId, item.quantity + 1)
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }

  const handleRemove = async () => {
    try {
      await removeFromCart(item.productId)
    } catch (error) {
      console.error('Error removing from cart:', error)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <Link href={`/products/${item.product.slug}`} className="flex-shrink-0">
          <div className="relative w-full sm:w-32 h-48 sm:h-32 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={item.product.image || '/placeholder-image.jpg'}
              alt={item.product.imageAlt || item.product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 128px"
            />
          </div>
        </Link>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <Link href={`/products/${item.product.slug}`}>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                {item.product.name}
              </h3>
            </Link>
            <p className="text-xl font-bold text-gray-900">
              ${item.price.toFixed(2)}
            </p>
            {item.product.stockQuantity <= 0 && (
              <p className="text-sm text-red-600">Out of stock</p>
            )}
          </div>

          {/* Quantity Controls and Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleDecrease}
                disabled={item.quantity <= 1}
                className={`p-2 rounded-lg border transition-colors ${
                  item.quantity <= 1
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-lg font-semibold text-gray-900 w-8 text-center">
                {item.quantity}
              </span>
              <button
                onClick={handleIncrease}
                disabled={item.product.stockQuantity > 0 && item.quantity >= item.product.stockQuantity}
                className={`p-2 rounded-lg border transition-colors ${
                  item.product.stockQuantity > 0 && item.quantity >= item.product.stockQuantity
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRemove}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Remove from cart"
              >
                <Trash2 className="h-4 w-4" />
                <span className="text-sm font-medium">Remove</span>
              </button>
            </div>
          </div>
        </div>

        {/* Total Price */}
        <div className="flex sm:flex-col items-end sm:items-start justify-between sm:justify-start gap-2">
          <div className="text-right sm:text-left">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-xl font-bold text-gray-900">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
