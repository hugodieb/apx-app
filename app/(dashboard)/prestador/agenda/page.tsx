"use client"

import { usePrestadorAuth } from "@/store/auth"
import { PrestadorLayout } from "@/components/dashboard/prestador/prestador-layout"
import PrestadorMainAgendaPage from "@/components/dashboard/prestador/prestador-main-agenda"
import { useAppointmentStore } from "@/store/appointmentStore"
import LoadingSpinner from "@/app/loading"

export default function PrestadorAgendaPage() {
  const { user } = usePrestadorAuth()
  const { getAppointments, isLoadingAppointments } = useAppointmentStore()

  const providerAppointments = getAppointments().filter((appointment) => appointment.providerId === user?.id)

  return (
    <PrestadorLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Gerenciamento de Agenda</h1>
        {isLoadingAppointments ? (
          <LoadingSpinner title="Atualizando agenda..." />
        ) : providerAppointments.length > 0 ? (
          <PrestadorMainAgendaPage />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-screen">
            Nenhum agendamento disponível no momento...
          </div>
        )}
      </div>
    </PrestadorLayout>
  )
}
