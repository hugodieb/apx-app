"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

export function ServiceCarousel() {
  const [current, setCurrent] = useState(0)

  const services = [
    {
      title: "Barbearias",
      image: "/barber.png",
      description: "Cortes de cabelo, barba e tratamentos capilares.",
    },
    {
      title: "Estúdios de Tatuagem",
      image: "/tattoo.png",
      description: "Arte corporal com profissionais talentosos.",
    },
    {
      title: "Salões de Beleza",
      image: "/beleza.png",
      description: "Tratamentos de beleza para cabelo, unhas e pele.",
    },
    {
      title: "Massagistas",
      image: "/massagista.png",
      description: "Relaxe com massagens terapêuticas profissionais.",
    },
    {
      title: "Eletricistas",
      image: "/eletricista.png",
      description: "Serviços elétricos residenciais e comerciais.",
    },
  ]

  const next = () => {
    setCurrent((current + 1) % services.length)
  }

  const prev = () => {
    setCurrent((current - 1 + services.length) % services.length)
  }

  // Auto-scroll
  useEffect(() => {
    const timer = setTimeout(() => {
      next()
    }, 5000)
    return () => clearTimeout(timer)
  }, [current])

  return (
    <section className="py-16" id="services">
      <h2 className="text-3xl font-bold text-center mb-12">Serviços Disponíveis</h2>

      <div className="relative">
        <div className="overflow-hidden rounded-lg">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {services.map((service, index) => (
              <Card key={index} className="min-w-full bg-slate-800 border-none">
                <CardContent className="p-0">
                  <div className="relative h-64 md:h-80 lg:h-96">
                    <Image
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      fill
                      className="object-cover rounded-t-lg"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                    <p className="text-slate-300 mb-4">{service.description}</p>
                    <Button className="bg-orange-500 hover:bg-orange-600">Explorar</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-slate-900/80 border-none hover:bg-slate-800"
          onClick={prev}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900/80 border-none hover:bg-slate-800"
          onClick={next}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        <div className="flex justify-center mt-4 gap-2">
          {services.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full ${current === index ? "bg-orange-500" : "bg-slate-600"}`}
              onClick={() => setCurrent(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
