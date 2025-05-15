"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useClienteAuth } from "@/store/auth"
import { ClienteLayout } from "@/components/dashboard/cliente/cliente-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Check, Lock, Bell, Globe, Moon } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
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

type PasswordFormValues = z.infer<typeof passwordSchema>
type PreferencesFormValues = z.infer<typeof preferencesSchema>

export default function ClienteConfiguracoesPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useClienteAuth()
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false)
  const [isSubmittingPreferences, setIsSubmittingPreferences] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "cliente") {
      router.push("/cliente/login")
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
      notifications: user?.preferences.notifications ?? true,
      emailMarketing: user?.preferences.emailMarketing ?? false,
      darkMode: user?.preferences.darkMode ?? false,
      language: user?.preferences.language ?? "pt-BR",
    },
  })

  async function onPasswordSubmit(data: PasswordFormValues) {
    setIsSubmittingPassword(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      console.log("update de senha")
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
      setSuccessMessage("Preferências atualizadas com sucesso!")

    } catch (error) {
      setErrorMessage("Ocorreu um erro ao atualizar as preferências. Tente novamente.")
    } finally {
      setIsSubmittingPreferences(false)
    }
  }

  if (!isAuthenticated || user?.type !== "cliente") {
    return null
  }

  return (
    <ClienteLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Configurações</h1>

        <Tabs defaultValue="senha" className="mb-8">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="senha">Alterar Senha</TabsTrigger>
            <TabsTrigger value="preferencias">Preferências</TabsTrigger>
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
                  <Lock className="h-5 w-5 mr-2 text-orange-500" />
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
                      className="w-full bg-orange-500 hover:bg-orange-600"
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
                              <Bell className="h-4 w-4 mr-2 text-orange-500" />
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
                              <Moon className="h-4 w-4 mr-2 text-orange-500" />
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
                            <Globe className="h-4 w-4 mr-2 text-orange-500" />
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
                      className="w-full bg-orange-500 hover:bg-orange-600"
                      disabled={isSubmittingPreferences}
                    >
                      {isSubmittingPreferences ? "Salvando..." : "Salvar Preferências"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ClienteLayout>
  )
}
