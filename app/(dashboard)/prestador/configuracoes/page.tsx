"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth"
import { PrestadorLayout } from "@/components/dashboard/prestador/prestador-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Check, Lock, Bell, Globe, Moon, DollarSign } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Language } from "@/types/settings-types"

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "A senha atual deve ter pelo menos 6 caracteres"),
    newPassword: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(6, "A confirmação de senha deve ter pelo menos 6 caracteres"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

const preferencesSchema = z.object({
  notifications: z.boolean(),
  emailMarketing: z.boolean(),
  darkMode: z.boolean(),
  language: z.string(),
})

const serviceSettingsSchema = z.object({
  serviceType: z.enum(["hora", "dia", "servico", "projeto"]),
  autoAcceptBookings: z.boolean(),
  advanceBookingDays: z.string(),
  cancellationPolicy: z.enum(["flexivel", "moderada", "rigorosa"]),
})

type PasswordFormValues = z.infer<typeof passwordSchema>
type PreferencesFormValues = z.infer<typeof preferencesSchema>
type ServiceSettingsFormValues = z.infer<typeof serviceSettingsSchema>

export default function PrestadorConfiguracoesPage() {
  const router = useRouter()
  const { user, isAuthenticated, updateSettings } = useAuthStore()
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false)
  const [isSubmittingPreferences, setIsSubmittingPreferences] = useState(false)
  const [isSubmittingServiceSettings, setIsSubmittingServiceSettings] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "prestador") {
      router.push("/prestador/login")
    }
  }, [isAuthenticated, user, router])

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const preferencesForm = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      notifications: user?.profile.preferences?.notifications ?? true,
      emailMarketing: user?.profile.preferences?.emailMarketing ?? false,
      darkMode: user?.profile.preferences?.darkMode ?? false,
      language: user?.profile.preferences?.language ?? "pt-BR",
    },
  })

  const serviceSettingsForm = useForm<ServiceSettingsFormValues>({
    resolver: zodResolver(serviceSettingsSchema),
    defaultValues: {
      serviceType: user?.serviceType || "hora",
      autoAcceptBookings: user?.autoAcceptBookings || false,
      advanceBookingDays: user?.advanceBookingDays?.toString() || "30",
      cancellationPolicy: user?.cancellationPolicy || "moderada",
    },
  })

  async function onPasswordSubmit(data: PasswordFormValues) {
    setIsSubmittingPassword(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      console.log("onPasswordSubmit")
    } catch (error) {
      setErrorMessage("Ocorreu um erro ao atualizar a senha. Tente novamente.")
    } finally {
      setIsSubmittingPassword(false)
    }
  }

  async function onPreferencesSubmit(data: PreferencesFormValues) {
    setIsSubmittingPreferences(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      updateSettings({ ...data, language: data.language as Language })

      setSuccessMessage("Preferências atualizadas com sucesso!")

    } catch (error) {
      setErrorMessage("Ocorreu um erro ao atualizar as preferências. Tente novamente.")
    } finally {
      setIsSubmittingPreferences(false)
    }
  }

  async function onServiceSettingsSubmit(data: ServiceSettingsFormValues) {
    setIsSubmittingServiceSettings(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      // Aqui seria implementada a lógica para atualizar as configurações de serviço
      console.log("Configurações de serviço atualizadas:", data)

      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 500))

      setSuccessMessage("Configurações de serviço atualizadas com sucesso!")
    } catch (error) {
      setErrorMessage("Ocorreu um erro ao atualizar as configurações de serviço. Tente novamente.")
    } finally {
      setIsSubmittingServiceSettings(false)
    }
  }

  if (!isAuthenticated || user?.type !== "prestador") {
    return null
  }

  return (
    <PrestadorLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Configurações</h1>

        <Tabs defaultValue="senha" className="mb-8">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="senha">Alterar Senha</TabsTrigger>
            <TabsTrigger value="preferencias">Preferências</TabsTrigger>
            <TabsTrigger value="servico">Configurações de Serviço</TabsTrigger>
          </TabsList>

          {successMessage && (
            <Alert className="mb-6 bg-green-900/20 border-green-800 text-green-300">
              <Check className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {errorMessage && (
            <Alert className="mb-6 bg-red-900/20 border-red-800 text-red-300">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <TabsContent value="senha">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-blue-500" />
                  Alterar Senha
                </CardTitle>
                <CardDescription>Atualize sua senha de acesso</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha Atual</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Digite sua senha atual"
                              {...field}
                              className="bg-slate-700 border-slate-600"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nova Senha</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Digite sua nova senha"
                              {...field}
                              className="bg-slate-700 border-slate-600"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar Nova Senha</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirme sua nova senha"
                              {...field}
                              className="bg-slate-700 border-slate-600"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-blue-700 hover:bg-blue-800"
                      disabled={isSubmittingPassword}
                    >
                      {isSubmittingPassword ? "Atualizando..." : "Atualizar Senha"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferencias">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Preferências</CardTitle>
                <CardDescription>Personalize sua experiência no aplicativo</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...preferencesForm}>
                  <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)} className="space-y-6">
                    <FormField
                      control={preferencesForm.control}
                      name="notifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-700 p-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center">
                              <Bell className="h-4 w-4 mr-2 text-blue-500" />
                              <FormLabel className="text-base">Notificações</FormLabel>
                            </div>
                            <FormDescription>Receber notificações sobre agendamentos e atualizações.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={preferencesForm.control}
                      name="emailMarketing"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-700 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Email Marketing</FormLabel>
                            <FormDescription>Receber emails sobre promoções e novidades.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={preferencesForm.control}
                      name="darkMode"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-700 p-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center">
                              <Moon className="h-4 w-4 mr-2 text-blue-500" />
                              <FormLabel className="text-base">Modo Escuro</FormLabel>
                            </div>
                            <FormDescription>Ativar o modo escuro na interface.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={preferencesForm.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center mb-2">
                            <Globe className="h-4 w-4 mr-2 text-blue-500" />
                            <FormLabel>Idioma</FormLabel>
                          </div>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-slate-700 border-slate-600">
                                <SelectValue placeholder="Selecione o idioma" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-slate-800 border-slate-700">
                              <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                              <SelectItem value="en-US">English (US)</SelectItem>
                              <SelectItem value="es-ES">Español</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-blue-700 hover:bg-blue-800"
                      disabled={isSubmittingPreferences}
                    >
                      {isSubmittingPreferences ? "Salvando..." : "Salvar Preferências"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="servico">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-blue-500" />
                  Configurações de Serviço
                </CardTitle>
                <CardDescription>Configure como seus serviços são oferecidos e cobrados</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...serviceSettingsForm}>
                  <form onSubmit={serviceSettingsForm.handleSubmit(onServiceSettingsSubmit)} className="space-y-6">
                    <FormField
                      control={serviceSettingsForm.control}
                      name="serviceType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Tipo de Serviço</FormLabel>
                          <FormDescription>Escolha como você deseja cobrar pelos seus serviços</FormDescription>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border border-slate-700 p-4">
                                <FormControl>
                                  <RadioGroupItem value="hora" />
                                </FormControl>
                                <FormLabel className="font-normal">Por Hora</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border border-slate-700 p-4">
                                <FormControl>
                                  <RadioGroupItem value="dia" />
                                </FormControl>
                                <FormLabel className="font-normal">Por Dia</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border border-slate-700 p-4">
                                <FormControl>
                                  <RadioGroupItem value="servico" />
                                </FormControl>
                                <FormLabel className="font-normal">Por Serviço</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border border-slate-700 p-4">
                                <FormControl>
                                  <RadioGroupItem value="projeto" />
                                </FormControl>
                                <FormLabel className="font-normal">Por Projeto</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={serviceSettingsForm.control}
                      name="autoAcceptBookings"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-700 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Aceitar Agendamentos Automaticamente</FormLabel>
                            <FormDescription>
                              Quando ativado, novos agendamentos serão aceitos automaticamente.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={serviceSettingsForm.control}
                      name="advanceBookingDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dias de Antecedência para Agendamento</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="365"
                              {...field}
                              className="bg-slate-700 border-slate-600"
                            />
                          </FormControl>
                          <FormDescription>
                            Número máximo de dias com antecedência que um cliente pode agendar.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={serviceSettingsForm.control}
                      name="cancellationPolicy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Política de Cancelamento</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-slate-700 border-slate-600">
                                <SelectValue placeholder="Selecione a política de cancelamento" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-slate-800 border-slate-700">
                              <SelectItem value="flexivel">Flexível (até 24h antes)</SelectItem>
                              <SelectItem value="moderada">Moderada (até 48h antes)</SelectItem>
                              <SelectItem value="rigorosa">Rigorosa (até 72h antes)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>Define o prazo para cancelamentos sem penalidade.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-blue-700 hover:bg-blue-800"
                      disabled={isSubmittingServiceSettings}
                    >
                      {isSubmittingServiceSettings ? "Salvando..." : "Salvar Configurações"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PrestadorLayout>
  )
}
