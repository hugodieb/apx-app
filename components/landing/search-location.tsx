"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Navigation } from "lucide-react"

export function SearchLocation() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState<"city" | "name" | "nearby">("city")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui seria implementada a lógica de busca real
    console.log(`Buscando por ${searchTerm} usando ${searchType}`)
  }

  return (
    <section className="py-16" id="search">
      <h2 className="text-3xl font-bold text-center mb-12">Encontre Prestadores de Serviço</h2>

      <Card className="bg-slate-800 border-none shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <Button
              variant={searchType === "city" ? "default" : "outline"}
              className={searchType === "city" ? "bg-blue-700 hover:bg-blue-800" : ""}
              onClick={() => setSearchType("city")}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Por Cidade
            </Button>
            <Button
              variant={searchType === "name" ? "default" : "outline"}
              className={searchType === "name" ? "bg-blue-700 hover:bg-blue-800" : ""}
              onClick={() => setSearchType("name")}
            >
              <Search className="mr-2 h-4 w-4" />
              Por Nome
            </Button>
            <Button
              variant={searchType === "nearby" ? "default" : "outline"}
              className={searchType === "nearby" ? "bg-blue-700 hover:bg-blue-800" : ""}
              onClick={() => setSearchType("nearby")}
            >
              <Navigation className="mr-2 h-4 w-4" />
              Próximos a Mim
            </Button>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder={
                searchType === "city"
                  ? "Digite o nome da cidade..."
                  : searchType === "name"
                    ? "Digite o nome do prestador..."
                    : "Buscar prestadores próximos..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-700 border-slate-600"
            />
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
              Buscar
            </Button>
          </form>

          {searchType === "nearby" && (
            <p className="mt-4 text-sm text-slate-400">
              Nota: Esta funcionalidade requer permissão de localização do seu navegador.
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
