"use client"

import { useEffect, useState } from "react"
import { usePrestadorAuth } from "@/store/auth"
import { PrestadorLayout } from "@/components/dashboard/prestador/prestador-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { useProviderAppointments } from "@/hooks/useProviderAppointments"
import { useAppointmentStore } from "@/store/appointmentStore"
import { AgendaPrestador } from "@/components/dashboard/prestador/agenda-prestador"
import { BloqueioHorarios } from "@/components/dashboard/prestador/bloqueio-horarios"
import { useAuth } from "@/hooks/useAuth"

export default function PrestadorAgendaPage() {
  const { isLoading } = useAuth()
  const { user } = usePrestadorAuth()
  const { getAppointments } = useAppointmentStore()
  const { appointmentsProvider } = useProviderAppointments()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [activeTab, setActiveTab] = useState("agenda")

  useEffect(() => {

    if (!isLoading && user) {
      appointmentsProvider(user)
    }
  }, [user, isLoading])

  // Filtrar agendamentos do prestador atual
  const providerAppointments = getAppointments().filter((appointment) => appointment.providerId === user?.id)

  // Ordenar por data (próximos primeiro)
  const sortedAppointments = [...providerAppointments].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )

  // Separar agendamentos por status
  const confirmedAppointments = sortedAppointments.filter(
    (appointment) => appointment.status === "confirmed" && new Date(appointment.date) > new Date(),
  )

  const pendingAppointments = sortedAppointments.filter((appointment) => appointment.status === "pending")

  // Filtrar agendamentos para a data selecionada
  const getAppointmentsForSelectedDate = () => {
    if (!date) return []

    return sortedAppointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date)
      return (
        appointmentDate.getDate() === date.getDate() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const selectedDateAppointments = getAppointmentsForSelectedDate()

  return (
    <PrestadorLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Gerenciamento de Agenda</h1>

        <Tabs defaultValue="agenda" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
            <TabsTrigger value="solicitacoes">Solicitações</TabsTrigger>
            <TabsTrigger value="bloqueios">Bloqueios</TabsTrigger>
          </TabsList>

          <TabsContent value="agenda">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle>Calendário</CardTitle>
                  <CardDescription>Selecione uma data para ver os agendamentos</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border border-slate-700"
                    classNames={{
                      day_selected:
                        "bg-blue-500 text-slate-50 hover:bg-blue-500 hover:text-slate-50 focus:bg-blue-500 focus:text-slate-50",
                      day_today: "bg-slate-700 text-slate-50",
                    }}
                  />
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Agendamentos do Dia</CardTitle>
                  <CardDescription>
                    {date
                      ? date.toLocaleDateString("pt-BR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                      : "Selecione uma data"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AgendaPrestador
                    agendamentos={selectedDateAppointments}
                    emptyMessage="Não há agendamentos para esta data."
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="solicitacoes">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Solicitações Pendentes</CardTitle>
                <CardDescription>Gerencie as solicitações de agendamento dos clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <AgendaPrestador
                  agendamentos={pendingAppointments}
                  emptyMessage="Não há solicitações pendentes."
                  showAcceptButton
                  showRejectButton
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bloqueios">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Bloqueio de Horários</CardTitle>
                <CardDescription>Bloqueie datas e horários em sua agenda</CardDescription>
              </CardHeader>
              <CardContent>
                <BloqueioHorarios />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PrestadorLayout>
  )
}
