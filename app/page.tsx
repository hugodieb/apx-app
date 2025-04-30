import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { ServiceCarousel } from "@/components/landing/service-carousel"
import { SearchLocation } from "@/components/landing/search-location"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ScrollToTop } from "@/components/layout/scroll-to-top"

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Header />
      <main className="container mx-auto px-4 pb-20">
        <Hero />
        <Features />
        <ServiceCarousel />
        <SearchLocation />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
