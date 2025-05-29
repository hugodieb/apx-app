"use client"

import { usePrestadorAuth } from "@/store/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building } from "lucide-react"
import { PrestadorLayout } from "@/components/dashboard/prestador/prestador-layout"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import PrestadorMainDashboard from "@/components/dashboard/prestador/prestador-main-dashboard"
import { useEffect } from "react"
import LoadingSpinner from "@/app/loading"
import { useProviderAppointments } from "@/hooks/useProviderAppointments"
import { useAppointmentStore } from "@/store/appointmentStore"

export default function PrestadorDashboardPage() {
  const { user } = usePrestadorAuth()
  const { getAppointments, isLoadingAppointments } = useAppointmentStore()
  const providerAppointments = getAppointments().filter((appointment) => appointment.providerId === user?.id)

  const hasEstablishment = user?.establishmentId && user.establishmentId.length > 0

  return (
    <PrestadorLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Olá, {user?.name}!</h1>

        {!hasEstablishment ? (
          <Card className="mb-6 bg-blue-900/20 border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-900/50 rounded-full">
                    <Building className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Cadastre seu estabelecimento</h3>
                    <p className="text-sm text-slate-400">
                      Para oferecer seus serviços, cadastre seu estabelecimento agora mesmo.
                    </p>
                  </div>
                </div>
                <Button asChild>
                  <Link href="/prestador/estabelecimento/novo">Cadastrar</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : isLoadingAppointments ? (
          <LoadingSpinner title="Atualizando agenda..." />
        ) : providerAppointments.length > 0 ? (
          <PrestadorMainDashboard />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-screen">
            Nenhum agendamento disponível no momento...
          </div>
        )}
      </div>
    </PrestadorLayout>
  )
}
