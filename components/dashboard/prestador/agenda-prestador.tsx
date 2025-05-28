"use client"

import { useState } from "react"
import { Calendar, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { format, isToday, isTomorrow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useProviderAppointments, } from "@/hooks/useProviderAppointments"
import { AppointmentWithClient } from "@/types/appointment"
import { usePrestadorAuth } from "@/store/auth"


interface AgendaPrestadorProps {
  agendamentos: AppointmentWithClient[]
  emptyMessage: string
  showAcceptButton?: boolean
  showRejectButton?: boolean
}

export function AgendaPrestador({
  agendamentos,
  emptyMessage,
  showAcceptButton = false,
  showRejectButton = false,
}: AgendaPrestadorProps) {
  const { user } = usePrestadorAuth()
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithClient | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const { acceptProviderAppointment, rejectProviderAppointment } = useProviderAppointments()

  const handleReject = (appointment: AppointmentWithClient) => {
    setSelectedAppointment(appointment)
    setRejectDialogOpen(true)
  }

  const confirmReject = () => {
    const appointmentId = selectedAppointment?.id

    setRejectDialogOpen(false)

    if (appointmentId) {
      rejectProviderAppointment(appointmentId, rejectReason)
    }
  }

  const acceptAppointment = (appointmentId: string) => {
    acceptProviderAppointment(appointmentId)
  }

  const showDetails = (appointment: AppointmentWithClient) => {
    setSelectedAppointment(appointment)
    setDetailsDialogOpen(true)
  }

  if (agendamentos.length === 0) {
    return <div className="text-center py-8 text-slate-400">{emptyMessage}</div>
  }

  // Ordenar agendamentos por horário
  const sortedAppointments = [...agendamentos].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Função para formatar a data de forma amigável
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isToday(date)) {
      return "Hoje"
    } else if (isTomorrow(date)) {
      return "Amanhã"
    } else {
      return format(date, "dd 'de' MMMM", { locale: ptBR })
    }
  }

  return (
    <div className="space-y-4">
      {sortedAppointments.map((agendamento) => {
        const cliente = agendamento.client
        const prestador = user
        const servico = prestador?.services.find((s) => s.id === agendamento.serviceId)
        const serviceType = prestador?.serviceType

        return (
          <Card key={agendamento.id} className="bg-slate-700 border-slate-600">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-700 flex items-center justify-center">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{cliente?.name || "Cliente"}</h3>
                    <p className="text-slate-300">{servico?.name}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                      <div className="flex items-center text-sm text-slate-300">
                        <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                        <span>{formatDate(agendamento.date)}</span>
                      </div>
                      {serviceType === "hora" || serviceType === "servico" ? (
                        <div className="flex items-center text-sm text-slate-300">
                          <Clock className="h-4 w-4 mr-1 text-blue-500" />
                          <span>
                            {new Date(agendamento.date).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      ) : (
                        <Badge
                          className={`${serviceType === "dia" ? "bg-green-600" : serviceType === "projeto" ? "bg-purple-600" : ""
                            }`}
                        >
                          {serviceType === "dia" ? "Dia Inteiro" : "Projeto"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:items-end gap-2">
                  <div className="text-lg font-semibold text-blue-500">R$ {agendamento.price.toFixed(2)}</div>
                  <div className="flex gap-2">
                    {showAcceptButton && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => acceptAppointment(agendamento.id)}
                      >
                        Aceitar
                      </Button>
                    )}
                    {showRejectButton && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => handleReject(agendamento)}
                      >
                        Recusar
                      </Button>
                    )}
                    {!showAcceptButton && !showRejectButton && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-500 text-slate-300 hover:bg-slate-600"
                        onClick={() => showDetails(agendamento)}
                      >
                        Detalhes
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Dialog de Rejeição */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="bg-slate-800 text-slate-100 border-slate-700">
          <DialogHeader>
            <DialogTitle>Recusar Agendamento</DialogTitle>
            <DialogDescription className="text-slate-400">Informe o motivo da recusa para o cliente</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Motivo da recusa</Label>
              <Textarea
                id="reason"
                placeholder="Explique o motivo da recusa..."
                className="bg-slate-700 border-slate-600"
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" className="bg-red-500 hover:bg-red-600" onClick={confirmReject}>
              Confirmar Recusa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Detalhes */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="bg-slate-800 text-slate-100 border-slate-700">
          <DialogHeader>
            <DialogTitle>Detalhes do Agendamento</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="py-4">
              <div className="space-y-4">
                {/* Informações do cliente */}
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2">Cliente</h4>
                  <div className="bg-slate-700 p-3 rounded-md">
                    <p className="font-medium">
                      {selectedAppointment.client?.name || "Cliente"}
                    </p>
                    <p className="text-sm text-slate-300">
                      {selectedAppointment.client?.phone || "Sem telefone"}
                    </p>
                  </div>
                </div>

                {/* Informações do serviço */}
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2">Serviço</h4>
                  <div className="bg-slate-700 p-3 rounded-md">
                    {(() => {
                      const servico = user?.services.find((s) => s.id === selectedAppointment.serviceId)
                      const serviceType = user?.serviceType

                      return (
                        <>
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-medium">{servico?.name}</p>
                            <Badge
                              className={`${serviceType === "hora"
                                ? "bg-blue-600"
                                : serviceType === "dia"
                                  ? "bg-green-600"
                                  : serviceType === "servico"
                                    ? "bg-orange-600"
                                    : "bg-purple-600"
                                }`}
                            >
                              {serviceType === "hora"
                                ? "Por Hora"
                                : serviceType === "dia"
                                  ? "Por Dia"
                                  : serviceType === "servico"
                                    ? "Por Serviço"
                                    : "Projeto"}
                            </Badge>
                          </div>
                          <p className="text-lg font-semibold text-blue-500 mb-2">
                            R$ {selectedAppointment.price.toFixed(2)}
                          </p>
                          <div className="text-sm text-slate-300">
                            {serviceType === "hora" || serviceType === "servico" ? (
                              <>
                                <p>
                                  Data:{" "}
                                  {format(new Date(selectedAppointment.date), "dd/MM/yyyy 'às' HH:mm", {
                                    locale: ptBR,
                                  })}
                                </p>
                                <p>Duração: {servico?.duration} minutos</p>
                              </>
                            ) : serviceType === "dia" ? (
                              <p>
                                Data: {format(new Date(selectedAppointment.date), "dd/MM/yyyy", { locale: ptBR })} (Dia
                                inteiro)
                              </p>
                            ) : (
                              <>
                                <p>
                                  Início: {format(new Date(selectedAppointment.date), "dd/MM/yyyy", { locale: ptBR })}
                                </p>
                                {selectedAppointment.endDate && (
                                  <p>
                                    Término:{" "}
                                    {format(new Date(selectedAppointment.endDate), "dd/MM/yyyy", { locale: ptBR })}
                                  </p>
                                )}
                                <p>
                                  Duração estimada: {Math.ceil((servico?.duration || 0) / (8 * 60))} dia(s) (
                                  {Math.floor((servico?.duration || 0) / 60)}h
                                  {(servico?.duration || 0) % 60 > 0 && ` ${(servico?.duration || 0) % 60}min`})
                                </p>
                              </>
                            )}
                          </div>
                        </>
                      )
                    })()}
                  </div>
                </div>

                {/* Status do agendamento */}
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2">Status</h4>
                  <div className="bg-slate-700 p-3 rounded-md">
                    <Badge
                      className={`${selectedAppointment.status === "confirmed"
                        ? "bg-green-600"
                        : selectedAppointment.status === "pending"
                          ? "bg-yellow-600"
                          : "bg-red-600"
                        }`}
                    >
                      {selectedAppointment.status === "confirmed"
                        ? "Confirmado"
                        : selectedAppointment.status === "pending"
                          ? "Pendente"
                          : "Cancelado"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button className="bg-blue-700 hover:bg-blue-800" onClick={() => setDetailsDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
