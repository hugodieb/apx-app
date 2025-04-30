"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth"
import { mockAppointments } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, User } from "lucide-react"
import { ClienteLayout } from "@/components/dashboard/cliente/cliente-layout"

export default function ClienteDashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "cliente") {
      router.push("/cliente/login")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.type !== "cliente") {
    //debugger
    return null
  }

  // Filtrar agendamentos do cliente atual
  const clientAppointments = mockAppointments.filter((appointment) => appointment.clientId === user.id)

  // Ordenar por data (próximos primeiro)
  const sortedAppointments = [...clientAppointments].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )

  // Separar agendamentos pendentes e confirmados
  const pendingAppointments = sortedAppointments.filter((appointment) => appointment.status === "pending")

  const confirmedAppointments = sortedAppointments.filter((appointment) => appointment.status === "confirmed")

  return (
    <ClienteLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Olá, {user.name}!</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Próximo Agendamento</CardTitle>
            </CardHeader>
            <CardContent>
              {confirmedAppointments.length > 0 ? (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <span>{new Date(confirmedAppointments[0].date).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span>
                      {new Date(confirmedAppointments[0].date).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <User className="h-4 w-4 text-orange-500" />
                    <span>João Barbeiro</span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                  >
                    Ver Detalhes
                  </Button>
                </div>
              ) : (
                <div className="text-slate-400 py-4 text-center">Você não tem agendamentos confirmados.</div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Agendamentos Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingAppointments.length > 0 ? (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span>{new Date(pendingAppointments[0].date).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>
                      {new Date(pendingAppointments[0].date).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <User className="h-4 w-4 text-blue-500" />
                    <span>João Barbeiro</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                    >
                      Confirmar
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-slate-400 py-4 text-center">Você não tem agendamentos pendentes.</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Serviços Recomendados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((_, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Prestador {index + 1}</h3>
                      <div className="text-sm text-slate-400 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>2.5 km de distância</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm mb-3">Especializado em cortes modernos e barba.</p>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">Agendar</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Atividade Recente</h2>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-0">
              <div className="divide-y divide-slate-700">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium">Serviço Concluído</h3>
                      <span className="text-sm text-slate-400">
                        {new Date(Date.now() - index * 86400000).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 mb-1">Corte de cabelo com João Barbeiro</p>
                    <div className="flex justify-between items-center">
                      <span className="text-orange-500 font-medium">R$ 50,00</span>
                      <Button variant="link" className="text-blue-500 p-0 h-auto">
                        Avaliar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClienteLayout>
  )
}
