"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth"
import { ClienteLayout } from "@/components/dashboard/cliente/cliente-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { mockAppointments } from "@/lib/mock-data"
import { AgendamentosList } from "@/components/dashboard/cliente/agendamentos-list"
import { NovoAgendamento } from "@/components/dashboard/cliente/novo-agendamento"

export default function ClienteAgendamentosPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [activeTab, setActiveTab] = useState("proximos")

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "cliente") {
      router.push("/cliente/login")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.type !== "cliente") {
    return null
  }

  // Filtrar agendamentos do cliente atual
  const clientAppointments = mockAppointments.filter((appointment) => appointment.clientId === user.id)

  // Separar agendamentos por status
  const proximosAgendamentos = clientAppointments
    .filter((appointment) => appointment.status === "confirmed" && new Date(appointment.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const pendentesAgendamentos = clientAppointments.filter((appointment) => appointment.status === "pending")

  const historicoAgendamentos = clientAppointments
    .filter((appointment) => appointment.status === "confirmed" && new Date(appointment.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <ClienteLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Meus Agendamentos</h1>

        <Tabs defaultValue="proximos" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="proximos">Próximos</TabsTrigger>
            <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="proximos">
            <AgendamentosList
              agendamentos={proximosAgendamentos}
              emptyMessage="Você não tem agendamentos confirmados."
              showCancelButton
            />
          </TabsContent>

          <TabsContent value="pendentes">
            <AgendamentosList
              agendamentos={pendentesAgendamentos}
              emptyMessage="Você não tem agendamentos pendentes."
              showCancelButton
              showConfirmButton
            />
          </TabsContent>

          <TabsContent value="historico">
            <AgendamentosList
              agendamentos={historicoAgendamentos}
              emptyMessage="Você não tem histórico de agendamentos."
              showReviewButton
            />
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
            <CardHeader>
              <CardTitle>Novo Agendamento</CardTitle>
              <CardDescription>Agende um novo serviço com um de nossos prestadores</CardDescription>
            </CardHeader>
            <CardContent>
              <NovoAgendamento />
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Calendário</CardTitle>
              <CardDescription>Visualize seus agendamentos</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border border-slate-700"
                classNames={{
                  day_selected:
                    "bg-orange-500 text-slate-50 hover:bg-orange-500 hover:text-slate-50 focus:bg-orange-500 focus:text-slate-50",
                  day_today: "bg-slate-700 text-slate-50",
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </ClienteLayout>
  )
}
