"use client"

import { usePrestadorAuth } from "@/store/auth"
import { mockAppointments } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, DollarSign, Star, User } from "lucide-react"

export default function PrestadorMainDashboard() {
  const { user } = usePrestadorAuth()
  const services = user?.services

  // Filtrar agendamentos do prestador atual
  const providerAppointments = mockAppointments.filter((appointment) => appointment.providerId === user?.id)

  // Ordenar por data (próximos primeiro)
  const sortedAppointments = [...providerAppointments].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )

  // Separar agendamentos pendentes e confirmados
  const pendingAppointments = sortedAppointments.filter((appointment) => appointment.status === "pending")

  const confirmedAppointments = sortedAppointments.filter((appointment) => appointment.status === "confirmed")

  // Calcular estatísticas
  const totalAppointments = providerAppointments.length
  const totalRevenue = providerAppointments.reduce((sum, appointment) => sum + appointment.price, 0)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Agendamentos Hoje</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div className="p-2 bg-blue-900/50 rounded-full">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Pendentes</p>
                <p className="text-2xl font-bold">{pendingAppointments.length}</p>
              </div>
              <div className="p-2 bg-orange-900/50 rounded-full">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Faturamento</p>
                <p className="text-2xl font-bold">R$ {totalRevenue}</p>
              </div>
              <div className="p-2 bg-green-900/50 rounded-full">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Avaliação</p>
                <p className="text-2xl font-bold">4.8</p>
              </div>
              <div className="p-2 bg-yellow-900/50 rounded-full">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Próximos Agendamentos</CardTitle>
          </CardHeader>
          <CardContent>
            {confirmedAppointments.length > 0 ? (
              <div className="space-y-4">
                {confirmedAppointments.slice(0, 3).map((appointment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">Maria Silva</h3>
                        <div className="text-sm text-slate-400 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>
                            {new Date(appointment.date).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-green-500">R$ {appointment.price}</span>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                >
                  Ver Todos
                </Button>
              </div>
            ) : (
              <div className="text-slate-400 py-4 text-center">Você não tem agendamentos confirmados.</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Solicitações Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingAppointments.length > 0 ? (
              <div className="space-y-4">
                {pendingAppointments.slice(0, 3).map((appointment, index) => (
                  <div key={index} className="p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-700 flex items-center justify-center">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">Maria Silva</h3>
                          <div className="text-sm text-slate-400 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>
                              {new Date(appointment.date).toLocaleDateString("pt-BR")} às{" "}
                              {new Date(appointment.date).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-orange-500">R$ {appointment.price}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button className="flex-1 bg-blue-700 hover:bg-blue-800" size="sm">
                        Aceitar
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        size="sm"
                      >
                        Recusar
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                >
                  Ver Todos
                </Button>
              </div>
            ) : (
              <div className="text-slate-400 py-4 text-center">Você não tem solicitações pendentes.</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Desempenho dos Serviços</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services?.map((service, index) => (
                <div key={index} className="p-3 bg-slate-700 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{service.name}</h3>
                    <span className="text-sm font-medium text-green-500">R$ {service.price}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-slate-400">
                    <span>Duração: {service.duration} min</span>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      <span>4.9</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${70 - index * 15}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-slate-400">{30 + index * 5} agendamentos</span>
                      <span className="text-slate-400">+{12 - index * 3}% este mês</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}