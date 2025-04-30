"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("resize", checkMobile)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <header
      className={`${
        isScrolled || isMobileMenuOpen ? "bg-slate-900 shadow-md" : "bg-transparent"
      } transition-all duration-300 ${!isMobile ? "sticky top-0 z-50" : ""}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-2xl font-bold text-orange-500">
            Apx App
          </Link>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => scrollToSection("features")}
              className="text-slate-300 hover:text-white transition-colors"
            >
              Recursos
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="text-slate-300 hover:text-white transition-colors"
            >
              Serviços
            </button>
            <button
              onClick={() => scrollToSection("search")}
              className="text-slate-300 hover:text-white transition-colors"
            >
              Buscar
            </button>
            <div className="flex space-x-2">
              <Button
                asChild
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
              >
                <Link href="/cliente/login">Entrar</Link>
              </Button>
              <Button asChild className="bg-orange-500 hover:bg-orange-600">
                <Link href="/cliente/cadastro">Cadastrar</Link>
              </Button>
            </div>
          </nav>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 pb-6 animate-in slide-in-from-top">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection("features")}
                className="text-slate-300 hover:text-white transition-colors py-2"
              >
                Recursos
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="text-slate-300 hover:text-white transition-colors py-2"
              >
                Serviços
              </button>
              <button
                onClick={() => scrollToSection("search")}
                className="text-slate-300 hover:text-white transition-colors py-2"
              >
                Buscar
              </button>
              <div className="flex flex-col space-y-2 pt-2">
                <Button
                  asChild
                  variant="outline"
                  className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white w-full"
                >
                  <Link href="/cliente/login">Entrar</Link>
                </Button>
                <Button asChild className="bg-orange-500 hover:bg-orange-600 w-full">
                  <Link href="/cliente/cadastro">Cadastrar</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
