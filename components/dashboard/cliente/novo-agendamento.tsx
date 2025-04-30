"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockUsers, mockEstablishments, mockBlockedTimes } from "@/lib/mock-data"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Check, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const agendamentoSchema = z.object({
  establishmentId: z.string({ required_error: "Selecione um estabelecimento" }),
  providerId: z.string({ required_error: "Selecione um prestador" }),
  serviceId: z.string({ required_error: "Selecione um serviço" }),
  date: z.date({ required_error: "Selecione uma data" }),
  time: z.string().optional(),
  endDate: z.date().optional(),
})

type AgendamentoFormValues = z.infer<typeof agendamentoSchema>

export function NovoAgendamento() {
  const [selectedEstablishment, setSelectedEstablishment] = useState<string | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serviceType, setServiceType] = useState<string | null>(null)
  const [serviceDuration, setServiceDuration] = useState<number | null>(null)

  const form = useForm<AgendamentoFormValues>({
    resolver: zodResolver(agendamentoSchema),
    defaultValues: {
      establishmentId: "",
      providerId: "",
      serviceId: "",
      time: "",
    },
  })

  // Gerar horários disponíveis com base na data selecionada e tipo de serviço
  const generateAvailableTimes = (date: Date | undefined, providerId: string | null) => {
    if (!date || !providerId) return []

    // Encontrar o prestador selecionado
    const provider = mockUsers.prestadores.find((p) => p.id === providerId)
    if (!provider) return []

    // Verificar o tipo de serviço do prestador
    const serviceType = provider.serviceType

    // Se o serviço for por dia ou projeto, não precisamos de horários específicos
    if (serviceType === "dia" || serviceType === "projeto") {
      return ["00:00"] // Apenas um valor para representar o dia inteiro
    }

    // Para serviços por hora ou por serviço, geramos os horários disponíveis
    const times = []
    const selectedDate = new Date(date)
    const dayOfWeek = selectedDate.getDay()
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const dayName = dayNames[dayOfWeek]

    // Obter o estabelecimento do prestador
    const establishment = mockEstablishments.find((e) => e.id === provider.establishmentId)
    if (!establishment) return []

    // Verificar se o estabelecimento está aberto neste dia
    const openingHours = establishment.openingHours[dayName as keyof typeof establishment.openingHours]
    if (!openingHours.open || !openingHours.close) return [] // Estabelecimento fechado neste dia

    // Converter horários de abertura e fechamento para minutos desde meia-noite
    const openTime = openingHours.open.split(":").map(Number)
    const closeTime = openingHours.close.split(":").map(Number)
    const openMinutes = openTime[0] * 60 + openTime[1]
    const closeMinutes = closeTime[0] * 60 + closeTime[1]

    // Verificar bloqueios para este prestador e data
    const dateString = format(selectedDate, "yyyy-MM-dd")
    const blockedTimes = mockBlockedTimes.filter(
      (block) => block.providerId === providerId && block.date === dateString,
    )

    // Verificar se o dia inteiro está bloqueado
    const isDayBlocked = blockedTimes.some((block) => block.allDay)
    if (isDayBlocked) return []

    // Obter bloqueios parciais
    const partialBlocks = blockedTimes.filter((block) => !block.allDay && block.startTime && block.endTime)

    // Gerar horários disponíveis em intervalos de 30 minutos
    for (let minutes = openMinutes; minutes < closeMinutes; minutes += 30) {
      const hour = Math.floor(minutes / 60)
      const minute = minutes % 60
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`

      // Verificar se este horário está dentro de algum bloqueio parcial
      const isBlocked = partialBlocks.some((block) => {
        const blockStart = block.startTime!.split(":").map(Number)
        const blockEnd = block.endTime!.split(":").map(Number)
        const blockStartMinutes = blockStart[0] * 60 + blockStart[1]
        const blockEndMinutes = blockEnd[0] * 60 + blockEnd[1]
        return minutes >= blockStartMinutes && minutes < blockEndMinutes
      })

      if (!isBlocked) {
        times.push(timeString)
      }
    }

    return times
  }

  const onDateChange = (date: Date | undefined) => {
    form.setValue("date", date as Date)
    form.setValue("time", "") // Resetar o horário quando a data muda

    if (selectedProvider) {
      setAvailableTimes(generateAvailableTimes(date, selectedProvider))
    }

    // Se for serviço por projeto, calcular a data de término com base na duração
    if (serviceType === "projeto" && serviceDuration) {
      const endDate = new Date(date!)
      // Converter duração de minutos para dias (assumindo 8 horas de trabalho por dia)
      const durationInDays = Math.ceil(serviceDuration / (8 * 60))
      endDate.setDate(endDate.getDate() + durationInDays - 1) // -1 porque o primeiro dia já está incluído
      form.setValue("endDate", endDate)
    }
  }

  const onEstablishmentChange = (establishmentId: string) => {
    setSelectedEstablishment(establishmentId)
    form.setValue("establishmentId", establishmentId)
    form.setValue("providerId", "") // Resetar o prestador quando o estabelecimento muda
    form.setValue("serviceId", "") // Resetar o serviço
    form.setValue("date", undefined as any) // Resetar a data
    form.setValue("time", "") // Resetar o horário
    setSelectedProvider(null)
    setServiceType(null)
    setServiceDuration(null)
    setAvailableTimes([])
  }

  const onProviderChange = (providerId: string) => {
    setSelectedProvider(providerId)
    form.setValue("providerId", providerId)
    form.setValue("serviceId", "") // Resetar o serviço quando o prestador muda
    form.setValue("date", undefined as any) // Resetar a data
    form.setValue("time", "") // Resetar o horário
    setAvailableTimes([])

    // Obter o tipo de serviço do prestador
    const provider = mockUsers.prestadores.find((p) => p.id === providerId)
    if (provider) {
      setServiceType(provider.serviceType)
    }
  }

  const onServiceChange = (serviceId: string) => {
    form.setValue("serviceId", serviceId)

    // Obter a duração do serviço
    if (selectedProvider) {
      const provider = mockUsers.prestadores.find((p) => p.id === selectedProvider)
      if (provider) {
        const service = provider.services.find((s) => s.id === serviceId)
        if (service) {
          setServiceDuration(service.duration)

          // Se já tiver uma data selecionada e for serviço por projeto, atualizar a data de término
          const selectedDate = form.getValues("date")
          if (serviceType === "projeto" && selectedDate) {
            const endDate = new Date(selectedDate)
            // Converter duração de minutos para dias (assumindo 8 horas de trabalho por dia)
            const durationInDays = Math.ceil(service.duration / (8 * 60))
            endDate.setDate(endDate.getDate() + durationInDays - 1) // -1 porque o primeiro dia já está incluído
            form.setValue("endDate", endDate)
          }
        }
      }
    }
  }

  const onSubmit = (data: AgendamentoFormValues) => {
    setIsSubmitting(true)

    // Simular uma chamada de API
    setTimeout(() => {
      console.log("Agendamento criado:", data)
      setIsSubmitting(false)
      setSuccessDialogOpen(true)
      form.reset()
      setSelectedEstablishment(null)
      setSelectedProvider(null)
      setServiceType(null)
      setServiceDuration(null)
      setAvailableTimes([])
    }, 1000)
  }

  // Filtrar estabelecimentos disponíveis
  const establishments = mockEstablishments

  // Filtrar prestadores do estabelecimento selecionado
  const providers = selectedEstablishment
    ? mockUsers.prestadores.filter((p) => p.establishmentId === selectedEstablishment)
    : []

  // Filtrar serviços do prestador selecionado
  const services = selectedProvider ? mockUsers.prestadores.find((p) => p.id === selectedProvider)?.services || [] : []

  // Renderizar o formulário de acordo com o tipo de serviço
  const renderServiceTypeForm = () => {
    if (!serviceType) return null

    switch (serviceType) {
      case "hora":
        return (
          <>
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data</FormLabel>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={onDateChange}
                    disabled={(date) => {
                      // Desabilitar datas passadas
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      return date < today
                    }}
                    className="rounded-md border border-slate-700"
                    classNames={{
                      day_selected:
                        "bg-orange-500 text-slate-50 hover:bg-orange-500 hover:text-slate-50 focus:bg-orange-500 focus:text-slate-50",
                      day_today: "bg-slate-700 text-slate-50",
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horário</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={availableTimes.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="Selecione um horário" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {availableTimes.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )

      case "dia":
        return (
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data</FormLabel>
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={onDateChange}
                  disabled={(date) => {
                    // Desabilitar datas passadas
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)

                    // Verificar bloqueios para este prestador
                    const dateString = format(date, "yyyy-MM-dd")
                    const isDayBlocked = mockBlockedTimes.some(
                      (block) => block.providerId === selectedProvider && block.date === dateString && block.allDay,
                    )

                    return date < today || isDayBlocked
                  }}
                  className="rounded-md border border-slate-700"
                  classNames={{
                    day_selected:
                      "bg-orange-500 text-slate-50 hover:bg-orange-500 hover:text-slate-50 focus:bg-orange-500 focus:text-slate-50",
                    day_today: "bg-slate-700 text-slate-50",
                  }}
                />
                <FormMessage />
                <div className="mt-2 text-sm text-slate-400">
                  <Info className="h-4 w-4 inline mr-1" />
                  Este serviço é agendado por dia inteiro.
                </div>
              </FormItem>
            )}
          />
        )

      case "servico":
        return (
          <>
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data</FormLabel>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={onDateChange}
                    disabled={(date) => {
                      // Desabilitar datas passadas
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      return date < today
                    }}
                    className="rounded-md border border-slate-700"
                    classNames={{
                      day_selected:
                        "bg-orange-500 text-slate-50 hover:bg-orange-500 hover:text-slate-50 focus:bg-orange-500 focus:text-slate-50",
                      day_today: "bg-slate-700 text-slate-50",
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horário</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={availableTimes.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="Selecione um horário" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {availableTimes.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  <div className="mt-2 text-sm text-slate-400">
                    <Info className="h-4 w-4 inline mr-1" />
                    {serviceDuration && (
                      <>
                        Duração estimada: {Math.floor(serviceDuration / 60)}h
                        {serviceDuration % 60 > 0 && ` ${serviceDuration % 60}min`}
                      </>
                    )}
                  </div>
                </FormItem>
              )}
            />
          </>
        )

      case "projeto":
        return (
          <>
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Início</FormLabel>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={onDateChange}
                    disabled={(date) => {
                      // Desabilitar datas passadas
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      return date < today
                    }}
                    className="rounded-md border border-slate-700"
                    classNames={{
                      day_selected:
                        "bg-orange-500 text-slate-50 hover:bg-orange-500 hover:text-slate-50 focus:bg-orange-500 focus:text-slate-50",
                      day_today: "bg-slate-700 text-slate-50",
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("date") && serviceDuration && (
              <div className="p-4 bg-slate-700 rounded-md">
                <h4 className="font-medium mb-2">Detalhes do Projeto</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Data de Início:</span>
                    <span>
                      {form.watch("date") && format(form.watch("date"), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Data de Término Estimada:</span>
                    <span>
                      {form.watch("endDate") &&
                        format(form.watch("endDate"), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Duração Estimada:</span>
                    <span>
                      {Math.ceil(serviceDuration / (8 * 60))} dia(s) ({Math.floor(serviceDuration / 60)}h
                      {serviceDuration % 60 > 0 && ` ${serviceDuration % 60}min`})
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )

      default:
        return null
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="establishmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estabelecimento</FormLabel>
                    <Select onValueChange={(value) => onEstablishmentChange(value)} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-700 border-slate-600">
                          <SelectValue placeholder="Selecione um estabelecimento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {establishments.map((establishment) => (
                          <SelectItem key={establishment.id} value={establishment.id}>
                            {establishment.name} - {establishment.category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedEstablishment && providers.length > 0 && (
                <FormField
                  control={form.control}
                  name="providerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prestador</FormLabel>
                      <Select onValueChange={(value) => onProviderChange(value)} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-700 border-slate-600">
                            <SelectValue placeholder="Selecione um prestador" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {providers.map((provider) => (
                            <SelectItem key={provider.id} value={provider.id}>
                              {provider.name} - {provider.profession}
                              {provider.rating && (
                                <span className="ml-2 text-yellow-500">★ {provider.rating.toFixed(1)}</span>
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {selectedProvider && (
                <FormField
                  control={form.control}
                  name="serviceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serviço</FormLabel>
                      <Select onValueChange={(value) => onServiceChange(value)} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-700 border-slate-600">
                            <SelectValue placeholder="Selecione um serviço" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {services.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name} - R$ {service.price.toFixed(2)}
                              {serviceType === "hora" && <span> ({service.duration} min)</span>}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {serviceType && (
                <div className="p-3 bg-slate-700 rounded-md">
                  <h4 className="font-medium mb-2">Tipo de Serviço</h4>
                  <Badge
                    className={`${
                      serviceType === "hora"
                        ? "bg-blue-600"
                        : serviceType === "dia"
                          ? "bg-green-600"
                          : serviceType === "servico"
                            ? "bg-orange-600"
                            : "bg-purple-600"
                    }`}
                  >
                    {serviceType === "hora"
                      ? "Agendamento por Hora"
                      : serviceType === "dia"
                        ? "Agendamento por Dia"
                        : serviceType === "servico"
                          ? "Agendamento por Serviço"
                          : "Agendamento por Projeto"}
                  </Badge>
                  <p className="text-sm mt-2 text-slate-300">
                    {serviceType === "hora"
                      ? "Selecione uma data e horário específicos."
                      : serviceType === "dia"
                        ? "Selecione uma data para reservar o dia inteiro."
                        : serviceType === "servico"
                          ? "Selecione uma data e horário para o serviço."
                          : "Selecione uma data de início para o projeto."}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">{renderServiceTypeForm()}</div>
          </div>

          {!selectedEstablishment && (
            <Alert className="bg-blue-900/20 border-blue-800 text-blue-300">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Selecione um estabelecimento para ver os prestadores disponíveis.</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600"
            disabled={isSubmitting || !form.formState.isValid}
          >
            {isSubmitting ? "Agendando..." : "Agendar Serviço"}
          </Button>
        </form>
      </Form>

      {/* Dialog de Sucesso */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="bg-slate-800 text-slate-100 border-slate-700">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center">Agendamento Realizado</DialogTitle>
            <DialogDescription className="text-center text-slate-400">
              Seu agendamento foi realizado com sucesso e está aguardando confirmação do prestador.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setSuccessDialogOpen(false)}>
              Entendi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
