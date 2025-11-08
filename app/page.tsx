import Header from "@/components/Header"
import Hero from "@/components/Hero"
import CategoryGrid from "@/components/CategoryGrid"
import FeaturedProducts from "@/components/FeaturedProducts"
import Benefits from "@/components/Benefits"
import Newsletter from "@/components/Newsletter"
import Footer from "@/components/Footer"
import Banner from "@/components/Banner"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Banner />
      <Header />
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <Benefits />
      <Newsletter />
      <Footer />
    </main>
  )
}

