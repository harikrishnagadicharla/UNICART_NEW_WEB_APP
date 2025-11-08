"use client"

export default function Newsletter() {
  return (
    <section className="w-full py-16 md:py-20 bg-blue-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Stay Updated
          </h2>
          <p className="text-blue-100 text-lg">
            Subscribe to our newsletter and get exclusive deals and updates
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

