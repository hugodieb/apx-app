"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth"
import { PrestadorLayout } from "@/components/dashboard/prestador/prestador-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, Camera, Check, Instagram, Facebook, User } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"

const profileSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  bio: z.string().optional(),
  profession: z.string().min(2, "Profissão é obrigatória"),
  birthDate: z.string().optional(),
  cpf: z.string().optional(),
  gender: z.enum(["masculino", "feminino", "outro", "prefiro_nao_informar"]).optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
    })
    .optional(),
  socialMedia: z
    .object({
      instagram: z.string().optional(),
      facebook: z.string().optional(),
      whatsapp: z.string().optional(),
    })
    .optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function PrestadorPerfilPage() {
  const router = useRouter()
  const { user, isAuthenticated, updateProfile, updateProfessionalData } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "prestador") {
      router.push("/prestador/login")
    }
  }, [isAuthenticated, user, router])

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.profile.name || "",
      email: user?.profile.email || "",
      phone: user?.profile.phone || "",
      bio: user?.profile.bio || "",
      profession: user?.profession || "",
      birthDate: user?.profile.birthDate || "",
      cpf: user?.profile.cpf || "",
      gender: user?.profile.gender || "prefiro_nao_informar",
      address: {
        street: user?.profile.address?.street || "",
        city: user?.profile.address?.city || "",
        state: user?.profile.address?.state || "",
        zipCode: user?.profile.address?.zipCode || "",
      },
      socialMedia: {
        instagram: user?.profile.socialMedia?.instagram || "",
        facebook: user?.profile.socialMedia?.facebook || "",
        whatsapp: user?.profile.socialMedia?.whatsapp || "",
      },
    },
  })

  async function onSubmit(data: ProfileFormValues) {
    setIsSubmitting(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      updateProfile({
        ...data
      })

      if (data.profession) {
        updateProfessionalData({
          profession: data.profession
        })
      }

    } catch (error) {
      setErrorMessage("Ocorreu um erro ao atualizar o perfil. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated || user?.type !== "prestador") {
    return null
  }

  return (
    <PrestadorLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Meu Perfil Profissional</h1>

        <Tabs defaultValue="informacoes" className="mb-8">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="informacoes">Informações Pessoais</TabsTrigger>
            <TabsTrigger value="endereco">Endereço</TabsTrigger>
            <TabsTrigger value="social">Redes Sociais</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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

              <TabsContent value="informacoes">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle>Informações Pessoais e Profissionais</CardTitle>
                    <CardDescription>Atualize suas informações pessoais e profissionais</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative mb-4">
                        <Avatar className="h-24 w-24">
                          <AvatarImage
                            src={user.profile.avatar || "/placeholder.svg?height=96&width=96"}
                            alt={user.name}
                          />
                          <AvatarFallback className="bg-blue-700 text-white text-xl">
                            <User className="h-12 w-12" />
                          </AvatarFallback>
                        </Avatar>
                        <Button
                          size="icon"
                          className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-blue-700 hover:bg-blue-800"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-slate-400">Clique no ícone para alterar sua foto</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-slate-700 border-slate-600" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="profession"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Profissão</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-slate-700 border-slate-600" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-slate-700 border-slate-600" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-slate-700 border-slate-600" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de Nascimento</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} className="bg-slate-700 border-slate-600" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cpf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CPF</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-slate-700 border-slate-600" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gênero</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-slate-700 border-slate-600">
                                  <SelectValue placeholder="Selecione seu gênero" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-slate-800 border-slate-700">
                                <SelectItem value="masculino">Masculino</SelectItem>
                                <SelectItem value="feminino">Feminino</SelectItem>
                                <SelectItem value="outro">Outro</SelectItem>
                                <SelectItem value="prefiro_nao_informar">Prefiro não informar</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sobre Mim</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Conte um pouco sobre sua experiência profissional..."
                              className="bg-slate-700 border-slate-600"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-slate-400">
                            Esta informação será exibida publicamente para clientes.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="endereco">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle>Endereço</CardTitle>
                    <CardDescription>Atualize seu endereço profissional</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="address.street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rua e Número</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-slate-700 border-slate-600" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-slate-700 border-slate-600" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-slate-700 border-slate-600" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address.zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CEP</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-slate-700 border-slate-600" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="social">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle>Redes Sociais</CardTitle>
                    <CardDescription>Adicione suas redes sociais para aumentar sua visibilidade</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="socialMedia.instagram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Instagram className="h-4 w-4 mr-2 text-pink-500" />
                              Instagram
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="@seuusuario" {...field} className="bg-slate-700 border-slate-600" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="socialMedia.facebook"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Facebook className="h-4 w-4 mr-2 text-blue-500" />
                              Facebook
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="seuusuario" {...field} className="bg-slate-700 border-slate-600" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="socialMedia.whatsapp"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>WhatsApp</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="(11) 99999-9999"
                                {...field}
                                className="bg-slate-700 border-slate-600"
                              />
                            </FormControl>
                            <FormDescription className="text-slate-400">
                              Este número será usado para contato direto com clientes.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <div className="mt-6 flex justify-end">
                <Button type="submit" className="bg-blue-700 hover:bg-blue-800" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </div>
    </PrestadorLayout>
  )
}
