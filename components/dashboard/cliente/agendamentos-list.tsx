"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin, User, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { mockUsers } from "@/lib/mock-data"
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

interface Agendamento {
  id: string
  clientId: string
  providerId: string
  serviceId: string
  date: string
  status: string
  price: number
}

interface AgendamentosListProps {
  agendamentos: Agendamento[]
  emptyMessage: string
  showCancelButton?: boolean
  showConfirmButton?: boolean
  showReviewButton?: boolean
}

export function AgendamentosList({
  agendamentos,
  emptyMessage,
  showCancelButton = false,
  showConfirmButton = false,
  showReviewButton = false,
}: AgendamentosListProps) {
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Agendamento | null>(null)
  const [rating, setRating] = useState(0)
  const [reviewComment, setReviewComment] = useState("")
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)

  const handleReview = (appointment: Agendamento) => {
    setSelectedAppointment(appointment)
    setReviewDialogOpen(true)
  }

  const handleCancel = (appointment: Agendamento) => {
    setSelectedAppointment(appointment)
    setCancelDialogOpen(true)
  }

  const submitReview = () => {
    // Aqui seria implementada a lógica para enviar a avaliação
    console.log("Avaliação enviada:", { appointmentId: selectedAppointment?.id, rating, comment: reviewComment })
    setReviewDialogOpen(false)
    setRating(0)
    setReviewComment("")
  }

  const confirmCancel = () => {
    // Aqui seria implementada a lógica para cancelar o agendamento
    console.log("Agendamento cancelado:", selectedAppointment?.id)
    setCancelDialogOpen(false)
  }

  const confirmAppointment = (appointmentId: string) => {
    // Aqui seria implementada a lógica para confirmar o agendamento
    console.log("Agendamento confirmado:", appointmentId)
  }

  if (agendamentos.length === 0) {
    return <div className="text-center py-8 text-slate-400">{emptyMessage}</div>
  }

  return (
    <div className="space-y-4">
      {agendamentos.map((agendamento) => {
        const prestador = mockUsers.prestadores.find((p) => p.id === agendamento.providerId)
        const servico = prestador?.services.find((s) => s.id === agendamento.serviceId)

        return (
          <Card key={agendamento.id} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{prestador?.name}</h3>
                    <p className="text-slate-400">{servico?.name}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                      <div className="flex items-center text-sm text-slate-300">
                        <Calendar className="h-4 w-4 mr-1 text-orange-500" />
                        <span>{new Date(agendamento.date).toLocaleDateString("pt-BR")}</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-300">
                        <Clock className="h-4 w-4 mr-1 text-orange-500" />
                        <span>
                          {new Date(agendamento.date).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-slate-300">
                        <MapPin className="h-4 w-4 mr-1 text-orange-500" />
                        <span>São Paulo, SP</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:items-end gap-2">
                  <div className="text-lg font-semibold text-orange-500">R$ {agendamento.price.toFixed(2)}</div>
                  <div className="flex gap-2">
                    {showConfirmButton && (
                      <Button
                        size="sm"
                        className="bg-blue-700 hover:bg-blue-800"
                        onClick={() => confirmAppointment(agendamento.id)}
                      >
                        Confirmar
                      </Button>
                    )}
                    {showCancelButton && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => handleCancel(agendamento)}
                      >
                        Cancelar
                      </Button>
                    )}
                    {showReviewButton && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                        onClick={() => handleReview(agendamento)}
                      >
                        Avaliar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Dialog de Avaliação */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="bg-slate-800 text-slate-100 border-slate-700">
          <DialogHeader>
            <DialogTitle>Avaliar Serviço</DialogTitle>
            <DialogDescription className="text-slate-400">
              Compartilhe sua experiência com este serviço
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-center space-x-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                  <Star
                    className={`h-8 w-8 ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-slate-500"}`}
                  />
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Seu comentário</Label>
              <Textarea
                id="comment"
                placeholder="Conte-nos como foi sua experiência..."
                className="bg-slate-700 border-slate-600"
                rows={4}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600" onClick={submitReview}>
              Enviar Avaliação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Cancelamento */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="bg-slate-800 text-slate-100 border-slate-700">
          <DialogHeader>
            <DialogTitle>Cancelar Agendamento</DialogTitle>
            <DialogDescription className="text-slate-400">
              Tem certeza que deseja cancelar este agendamento?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-300">
              O cancelamento pode estar sujeito a políticas específicas do prestador de serviço.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Voltar
            </Button>
            <Button variant="destructive" className="bg-red-500 hover:bg-red-600" onClick={confirmCancel}>
              Confirmar Cancelamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
