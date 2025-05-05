"use client"

import { Button } from "@/components/ui/button"
import { Link } from "lucide-react"

export default function CadastroPage() {
  const router = useRouter()

  const handle = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent">Página ainda em construção</h1>
      <Button variant="link" onClick={handle} className="text-blue-500 text-2xl">Clique aqui voltar para home</Button>
    </div>
  )
}
import { useRouter } from "next/navigation"