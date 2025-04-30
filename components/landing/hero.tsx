import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="py-20 text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent">
        Apx App
      </h1>
      <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
        A maneira mais fácil de gerenciar seus serviços e clientes.
      </p>
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
          <Link href="/cliente/login">Entrar como Cliente</Link>
        </Button>
        <Button asChild size="lg" className="bg-blue-700 hover:bg-blue-800 text-white">
          <Link href="/prestador/login">Entrar como Prestador</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="border-blue-700 text-blue-500 hover:bg-blue-900">
          <Link href="/admin/login">Área do Admin</Link>
        </Button>
      </div>
    </section>
  )
}
