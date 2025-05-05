"use client"

import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { UserRound, Briefcase, Shield } from "lucide-react"

interface RegisterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RegisterDialog({ open, onOpenChange }: RegisterDialogProps) {
  const router = useRouter()

  const handleRegisterAs = (type: "cliente" | "prestador" | "admin") => {
    onOpenChange(false)
    router.push(`/${type}/cadastro`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Escolha seu tipo de cadastro</DialogTitle>
          <DialogDescription className="text-center text-slate-400">
            Selecione como você deseja se cadastrar na plataforma
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            onClick={() => handleRegisterAs("cliente")}
            className="flex items-center justify-start gap-3 h-auto py-6 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600"
          >
            <div className="bg-white/20 p-2 rounded-full">
              <UserRound className="h-6 w-6" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-lg">Cadastro como Cliente</h3>
              <p className="text-sm text-slate-200">Busque e contrate serviços de profissionais</p>
            </div>
          </Button>

          <Button
            onClick={() => handleRegisterAs("prestador")}
            className="flex items-center justify-start gap-3 h-auto py-6 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700"
          >
            <div className="bg-white/20 p-2 rounded-full">
              <Briefcase className="h-6 w-6" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-lg">Cadastro como Prestador</h3>
              <p className="text-sm text-slate-200">Ofereça seus serviços e gerencie sua agenda</p>
            </div>
          </Button>

          <Button
            onClick={() => handleRegisterAs("admin")}
            className="flex items-center justify-start gap-3 h-auto py-6 bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-800 hover:to-purple-700"
          >
            <div className="bg-white/20 p-2 rounded-full">
              <Shield className="h-6 w-6" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-lg">Cadastro como Administrador</h3>
              <p className="text-sm text-slate-200">Acesse o painel de controle do sistema</p>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
