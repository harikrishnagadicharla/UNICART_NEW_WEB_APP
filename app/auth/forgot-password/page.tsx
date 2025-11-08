"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowLeft } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Banner from "@/components/Banner"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Banner />
      <Header />
      
      <main className="flex-1 bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            {!submitted ? (
              <>
                {/* Header */}
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
                  <p className="text-gray-600">Enter your email to receive a password reset link</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Send Reset Link
                  </button>
                </form>

                {/* Back to Login */}
                <Link
                  href="/auth/login"
                  className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </Link>
              </>
            ) : (
              <>
                {/* Success Message */}
                <div className="text-center space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <Mail className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Check your email
                    </h2>
                    <p className="text-gray-600">
                      We&apos;ve sent a password reset link to <strong>{email}</strong>
                    </p>
                  </div>
                  <Link
                    href="/auth/login"
                    className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

