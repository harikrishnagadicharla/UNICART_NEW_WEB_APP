import { Truck, RotateCcw, Shield } from "lucide-react"

const benefits = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $50",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day return policy",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure checkout",
  },
]

export default function Benefits() {
  return (
    <section className="w-full py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <div
                key={benefit.title}
                className="flex flex-col items-center text-center p-6 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

