"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CalendarIcon, Clock, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { mockUsers } from "@/lib/mock-data"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const bloqueioSchema = z.object({
  date: z.date({ required_error: "Selecione uma data" }),
  allDay: z.boolean().default(false),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  reason: z.string().min(3, "Informe um motivo com pelo menos 3 caracteres").max(100),
  repeat: z.boolean().default(false),
  repeatDays: z.array(z.string()).optional(),
  serviceType: z.string().optional(), // Tipo de serviço a ser bloqueado
})

type BloqueioFormValues = z.infer<typeof bloqueioSchema>

// Tipo para os bloqueios
interface Bloqueio {
  id: string
  date: Date
  allDay: boolean
  startTime?: string
  endTime?: string
  reason: string
  repeat: boolean
  repeatDays?: string[]
  serviceType?: string
}

export function BloqueioHorarios() {
  const [activeTab, setActiveTab] = useState("criar")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  const [bloqueios, setBloqueios] = useState<Bloqueio[]>([
    {
      id: "1",
      date: new Date(2025, 3, 15), // 15 de abril de 2025
      allDay: true,
      reason: "Feriado",
      repeat: false,
    },
    {
      id: "2",
      date: new Date(2025, 3, 20), // 20 de abril de 2025
      allDay: false,
      startTime: "14:00",
      endTime: "18:00",
      reason: "Compromisso pessoal",
      repeat: false,
    },
    {
      id: "3",
      date: new Date(2025, 3, 25), // 25 de abril de 2025
      allDay: false,
      startTime: "09:00",
      endTime: "12:00",
      reason: "Manutenção do espaço",
      repeat: true,
      repeatDays: ["monday"],
    },
  ])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedBloqueio, setSelectedBloqueio] = useState<string | null>(null)
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string | null>(null)

  // Obter o tipo de serviço do prestador atual
  const currentUser = mockUsers.prestadores[0] // Simulando o usuário logado
  const userServiceType = currentUser?.serviceType || "hora"

  const form = useForm<BloqueioFormValues>({
    resolver: zodResolver(bloqueioSchema),
    defaultValues: {
      allDay: false,
      repeat: false,
      repeatDays: [],
      reason: "",
      serviceType: userServiceType,
    },
  })

  const watchAllDay = form.watch("allDay")
  const watchRepeat = form.watch("repeat")

  const onSubmit = (data: BloqueioFormValues) => {
    setIsSubmitting(true)

    // Simular uma chamada de API
    setTimeout(() => {
      console.log("Bloqueio criado:", data)

      // Adicionar o novo bloqueio à lista
      const novoBloqueio: Bloqueio = {
        id: Date.now().toString(),
        date: data.date,
        allDay: data.allDay,
        startTime: data.startTime,
        endTime: data.endTime,
        reason: data.reason,
        repeat: data.repeat,
        repeatDays: data.repeatDays,
        serviceType: data.serviceType,
      }

      setBloqueios([...bloqueios, novoBloqueio])

      setIsSubmitting(false)
      setSuccessDialogOpen(true)
      form.reset({
        allDay: false,
        repeat: false,
        repeatDays: [],
        reason: "",
        serviceType: userServiceType,
      })
    }, 1000)
  }

  const handleDelete = (id: string) => {
    setSelectedBloqueio(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedBloqueio) {
      setBloqueios(bloqueios.filter((b) => b.id !== selectedBloqueio))
      setDeleteDialogOpen(false)
      setSelectedBloqueio(null)
    }
  }

  // Dias da semana para repetição
  const diasSemana = [
    { value: "sunday", label: "Domingo" },
    { value: "monday", label: "Segunda" },
    { value: "tuesday", label: "Terça" },
    { value: "wednesday", label: "Quarta" },
    { value: "thursday", label: "Quinta" },
    { value: "friday", label: "Sexta" },
    { value: "saturday", label: "Sábado" },
  ]

  // Gerar horários para seleção
  const gerarHorarios = () => {
    const horarios = []
    for (let hora = 8; hora <= 20; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        const horaFormatada = hora.toString().padStart(2, "0")
        const minutoFormatado = minuto.toString().padStart(2, "0")
        horarios.push(`${horaFormatada}:${minutoFormatado}`)
      }
    }
    return horarios
  }

  const horarios = gerarHorarios()

  // Renderizar o formulário de acordo com o tipo de serviço
  const renderServiceTypeForm = () => {
    const serviceType = form.watch("serviceType") || userServiceType

    switch (serviceType) {
      case "hora":
      case "servico":
        return (
          <>
            <FormField
              control={form.control}
              name="allDay"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-700 p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Dia Inteiro</FormLabel>
                    <FormDescription>Bloquear o dia inteiro, sem disponibilidade para agendamentos.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {!watchAllDay && (
              <>
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário Inicial</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-700 border-slate-600">
                            <SelectValue placeholder="Selecione o horário inicial" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-800 border-slate-700 max-h-[200px]">
                          {horarios.map((horario) => (
                            <SelectItem key={`start-${horario}`} value={horario}>
                              {horario}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário Final</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-700 border-slate-600">
                            <SelectValue placeholder="Selecione o horário final" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-800 border-slate-700 max-h-[200px]">
                          {horarios.map((horario) => (
                            <SelectItem key={`end-${horario}`} value={horario}>
                              {horario}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </>
        )

      case "dia":
        return (
          <div className="p-4 bg-slate-700 rounded-md">
            <h4 className="font-medium mb-2">Bloqueio por Dia</h4>
            <p className="text-sm text-slate-300 mb-4">
              Para serviços agendados por dia, o bloqueio sempre será para o dia inteiro.
            </p>
            <Badge className="bg-green-600">Dia Inteiro</Badge>
          </div>
        )

      case "projeto":
        return (
          <div className="p-4 bg-slate-700 rounded-md">
            <h4 className="font-medium mb-2">Bloqueio para Projetos</h4>
            <p className="text-sm text-slate-300 mb-4">
              Para serviços de projeto, o bloqueio afetará a disponibilidade para novos projetos a partir da data
              selecionada.
            </p>
            <Badge className="bg-purple-600">Indisponível para Novos Projetos</Badge>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      <Tabs defaultValue="criar" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="criar">Criar Bloqueio</TabsTrigger>
          <TabsTrigger value="gerenciar">Gerenciar Bloqueios</TabsTrigger>
        </TabsList>

        <TabsContent value="criar">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data</FormLabel>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            // Desabilitar datas passadas
                            const today = new Date()
                            today.setHours(0, 0, 0, 0)
                            return date < today
                          }}
                          className="rounded-md border border-slate-700"
                          classNames={{
                            day_selected:
                              "bg-blue-500 text-slate-50 hover:bg-blue-500 hover:text-slate-50 focus:bg-blue-500 focus:text-slate-50",
                            day_today: "bg-slate-700 text-slate-50",
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  {userServiceType !== "dia" && userServiceType !== "projeto" && renderServiceTypeForm()}

                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Motivo</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Informe o motivo do bloqueio"
                            {...field}
                            className="bg-slate-700 border-slate-600"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="repeat"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-700 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Repetir</FormLabel>
                          <FormDescription>Repetir este bloqueio em dias específicos da semana.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {watchRepeat && (
                    <FormField
                      control={form.control}
                      name="repeatDays"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">Dias da Semana</FormLabel>
                            <FormDescription>Selecione os dias da semana para repetir o bloqueio.</FormDescription>
                          </div>
                          <div className="space-y-2">
                            {diasSemana.map((dia) => (
                              <FormField
                                key={dia.value}
                                control={form.control}
                                name="repeatDays"
                                render={({ field }) => {
                                  return (
                                    <FormItem key={dia.value} className="flex flex-row items-start space-x-3 space-y-0">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(dia.value)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...(field.value || []), dia.value])
                                              : field.onChange(field.value?.filter((value) => value !== dia.value))
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">{dia.label}</FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800" disabled={isSubmitting}>
                {isSubmitting ? "Criando Bloqueio..." : "Criar Bloqueio"}
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="gerenciar">
          {bloqueios.length === 0 ? (
            <Alert className="bg-blue-900/20 border-blue-800 text-blue-300">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Você não possui bloqueios cadastrados.</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {bloqueios.map((bloqueio) => (
                <Card key={bloqueio.id} className="bg-slate-700 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center">
                          <CalendarIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-lg">{bloqueio.reason}</h3>
                            {bloqueio.repeat && <Badge className="bg-purple-700">Recorrente</Badge>}
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                            <div className="flex items-center text-sm text-slate-300">
                              <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                              <span>{format(bloqueio.date, "dd 'de' MMMM", { locale: ptBR })}</span>
                            </div>
                            {bloqueio.allDay ? (
                              <Badge className="bg-red-700">Dia Inteiro</Badge>
                            ) : (
                              <div className="flex items-center text-sm text-slate-300">
                                <Clock className="h-4 w-4 mr-1 text-blue-500" />
                                <span>
                                  {bloqueio.startTime} - {bloqueio.endTime}
                                </span>
                              </div>
                            )}
                          </div>
                          {bloqueio.repeat && bloqueio.repeatDays && bloqueio.repeatDays.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {bloqueio.repeatDays.map((day) => (
                                <Badge key={day} variant="outline" className="border-blue-700 text-blue-400">
                                  {diasSemana.find((d) => d.value === day)?.label}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                          onClick={() => handleDelete(bloqueio.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remover
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog de Sucesso */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="bg-slate-800 text-slate-100 border-slate-700">
          <DialogHeader>
            <DialogTitle>Bloqueio Criado</DialogTitle>
            <DialogDescription className="text-slate-400">
              O bloqueio foi criado com sucesso em sua agenda.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="bg-blue-700 hover:bg-blue-800"
              onClick={() => {
                setSuccessDialogOpen(false)
                setActiveTab("gerenciar")
              }}
            >
              Ver Bloqueios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-slate-800 text-slate-100 border-slate-700">
          <DialogHeader>
            <DialogTitle>Remover Bloqueio</DialogTitle>
            <DialogDescription className="text-slate-400">
              Tem certeza que deseja remover este bloqueio da sua agenda?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" className="bg-red-500 hover:bg-red-600" onClick={confirmDelete}>
              Confirmar Remoção
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
