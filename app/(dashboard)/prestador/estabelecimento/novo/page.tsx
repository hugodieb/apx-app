"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useAuthStore } from "@/store/auth"
import { PrestadorLayout } from "@/components/dashboard/prestador/prestador-layout"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimeInput } from "@/components/ui/time-input"
import { toast } from "@/components/ui/use-toast"
import { Building, Clock, MapPin, Save } from "lucide-react"

// Esquema de validação para o formulário de estabelecimento
const establishmentFormSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  description: z.string().min(10, { message: "A descrição deve ter pelo menos 10 caracteres" }),
  category: z.string().min(1, { message: "Selecione uma categoria" }),
  phone: z.string().min(10, { message: "Informe um telefone válido" }),
  image: z.string().optional(),

  // Endereço
  street: z.string().min(5, { message: "Informe o endereço completo" }),
  city: z.string().min(2, { message: "Informe a cidade" }),
  state: z.string().length(2, { message: "Informe a sigla do estado (2 letras)" }),
  zipCode: z.string().min(8, { message: "Informe um CEP válido" }),

  // Horários de funcionamento
  mondayOpen: z.string().optional(),
  mondayClose: z.string().optional(),
  tuesdayOpen: z.string().optional(),
  tuesdayClose: z.string().optional(),
  wednesdayOpen: z.string().optional(),
  wednesdayClose: z.string().optional(),
  thursdayOpen: z.string().optional(),
  thursdayClose: z.string().optional(),
  fridayOpen: z.string().optional(),
  fridayClose: z.string().optional(),
  saturdayOpen: z.string().optional(),
  saturdayClose: z.string().optional(),
  sundayOpen: z.string().optional(),
  sundayClose: z.string().optional(),
})

type EstablishmentFormValues = z.infer<typeof establishmentFormSchema>

// Categorias de estabelecimentos
const categories = [
  "Barbearia",
  "Salão de Beleza",
  "Estética",
  "Limpeza",
  "Elétrica",
  "Hidráulica",
  "Engenharia",
  "Arquitetura",
  "Consultoria",
  "Outros",
]

export default function NovoEstabelecimentoPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState("informacoes")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Valores padrão para o formulário
  const defaultValues: Partial<EstablishmentFormValues> = {
    name: "",
    description: "",
    category: "",
    phone: user?.profile.phone || "",
    image: "/placeholder.svg?height=400&width=600",
    street: user?.profile.address?.street || "",
    city: user?.profile.address?.city || "",
    state: user?.profile.address?.state || "",
    zipCode: user?.profile.address?.zipCode || "",
    mondayOpen: "09:00",
    mondayClose: "18:00",
    tuesdayOpen: "09:00",
    tuesdayClose: "18:00",
    wednesdayOpen: "09:00",
    wednesdayClose: "18:00",
    thursdayOpen: "09:00",
    thursdayClose: "18:00",
    fridayOpen: "09:00",
    fridayClose: "18:00",
    saturdayOpen: "09:00",
    saturdayClose: "13:00",
    sundayOpen: "",
    sundayClose: "",
  }

  const form = useForm<EstablishmentFormValues>({
    resolver: zodResolver(establishmentFormSchema),
    defaultValues,
  })

  async function onSubmit(data: EstablishmentFormValues) {
    setIsSubmitting(true)

    try {
      // Aqui seria feita a chamada para a API para criar o estabelecimento
      console.log("Dados do estabelecimento:", data)

      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Formatando os dados para o formato esperado pelo backend
      const establishment = {
        id: `estab_${Date.now()}`,
        name: data.name,
        description: data.description,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
        },
        phone: data.phone,
        image: data.image,
        category: data.category,
        rating: 0, // Novo estabelecimento começa sem avaliações
        openingHours: {
          monday: { open: data.mondayOpen || "", close: data.mondayClose || "" },
          tuesday: { open: data.tuesdayOpen || "", close: data.tuesdayClose || "" },
          wednesday: { open: data.wednesdayOpen || "", close: data.wednesdayClose || "" },
          thursday: { open: data.thursdayOpen || "", close: data.thursdayClose || "" },
          friday: { open: data.fridayOpen || "", close: data.fridayClose || "" },
          saturday: { open: data.saturdayOpen || "", close: data.saturdayClose || "" },
          sunday: { open: data.sundayOpen || "", close: data.sundayClose || "" },
        },
      }

      console.log("Estabelecimento formatado:", establishment)

      toast({
        title: "Estabelecimento criado com sucesso!",
        description: "Seu estabelecimento foi cadastrado e já está disponível para seus clientes.",
      })

      // Redirecionar para a página de detalhes do estabelecimento
      router.push("/prestador/estabelecimento/detalhes")
    } catch (error) {
      console.error("Erro ao criar estabelecimento:", error)
      toast({
        title: "Erro ao criar estabelecimento",
        description: "Ocorreu um erro ao criar seu estabelecimento. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PrestadorLayout>
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Cadastrar Novo Estabelecimento</h1>
          <p className="text-muted-foreground">Preencha as informações abaixo para cadastrar seu estabelecimento</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="informacoes" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span>Informações</span>
                </TabsTrigger>
                <TabsTrigger value="endereco" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Endereço</span>
                </TabsTrigger>
                <TabsTrigger value="horarios" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Horários</span>
                </TabsTrigger>
              </TabsList>

              {/* Tab de Informações Básicas */}
              <TabsContent value="informacoes">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações do Estabelecimento</CardTitle>
                    <CardDescription>Informe os dados básicos do seu estabelecimento</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Estabelecimento</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Barbearia Vintage" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva seu estabelecimento e os serviços oferecidos"
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Categoria</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma categoria" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
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
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input placeholder="(00) 00000-0000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Imagem do Estabelecimento</FormLabel>
                          <FormControl>
                            <div className="flex flex-col gap-2">
                              <Input type="file" className="hidden" id="establishment-image" />
                              <div className="relative aspect-video overflow-hidden rounded-md border border-input">
                                <img
                                  src={field.value || "/placeholder.svg?height=400&width=600"}
                                  alt="Imagem do estabelecimento"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById("establishment-image")?.click()}
                              >
                                Selecionar Imagem
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>Selecione uma imagem que represente seu estabelecimento</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button type="button" onClick={() => setActiveTab("endereco")}>
                        Próximo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab de Endereço */}
              <TabsContent value="endereco">
                <Card>
                  <CardHeader>
                    <CardTitle>Endereço do Estabelecimento</CardTitle>
                    <CardDescription>Informe o endereço completo do seu estabelecimento</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Endereço</FormLabel>
                          <FormControl>
                            <Input placeholder="Rua, número, complemento" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade</FormLabel>
                            <FormControl>
                              <Input placeholder="Cidade" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <FormControl>
                              <Input placeholder="UF" maxLength={2} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem className="md:col-span-1">
                            <FormLabel>CEP</FormLabel>
                            <FormControl>
                              <Input placeholder="00000-000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setActiveTab("informacoes")}>
                        Voltar
                      </Button>
                      <Button type="button" onClick={() => setActiveTab("horarios")}>
                        Próximo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab de Horários */}
              <TabsContent value="horarios">
                <Card>
                  <CardHeader>
                    <CardTitle>Horários de Funcionamento</CardTitle>
                    <CardDescription>Defina os horários de funcionamento do seu estabelecimento</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Segunda-feira */}
                    <div className="grid grid-cols-3 items-center gap-4">
                      <div className="font-medium">Segunda-feira</div>
                      <FormField
                        control={form.control}
                        name="mondayOpen"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Abertura</FormLabel>
                            <FormControl>
                              <TimeInput placeholder="Abertura" value={field.value || ""} onValueChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="mondayClose"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Fechamento</FormLabel>
                            <FormControl>
                              <TimeInput placeholder="Fechamento" value={field.value || ""} onValueChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Terça-feira */}
                    <div className="grid grid-cols-3 items-center gap-4">
                      <div className="font-medium">Terça-feira</div>
                      <FormField
                        control={form.control}
                        name="tuesdayOpen"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Abertura</FormLabel>
                            <FormControl>
                              <TimeInput placeholder="Abertura" value={field.value || ""} onValueChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="tuesdayClose"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Fechamento</FormLabel>
                            <FormControl>
                              <TimeInput placeholder="Fechamento" value={field.value || ""} onValueChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Quarta-feira */}
                    <div className="grid grid-cols-3 items-center gap-4">
                      <div className="font-medium">Quarta-feira</div>
                      <FormField
                        control={form.control}
                        name="wednesdayOpen"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Abertura</FormLabel>
                            <FormControl>
                              <TimeInput placeholder="Abertura" value={field.value || ""} onValueChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="wednesdayClose"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Fechamento</FormLabel>
                            <FormControl>
                              <TimeInput placeholder="Fechamento" value={field.value || ""} onValueChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Quinta-feira */}
                    <div className="grid grid-cols-3 items-center gap-4">
                      <div className="font-medium">Quinta-feira</div>
                      <FormField
                        control={form.control}
                        name="thursdayOpen"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Abertura</FormLabel>
                            <FormControl>
                              <TimeInput placeholder="Abertura" value={field.value || ""} onValueChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="thursdayClose"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Fechamento</FormLabel>
                            <FormControl>
                              <TimeInput placeholder="Fechamento" value={field.value || ""} onValueChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Sexta-feira */}
                    <div className="grid grid-cols-3 items-center gap-4">
                      <div className="font-medium">Sexta-feira</div>
                      <FormField
                        control={form.control}
                        name="fridayOpen"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Abertura</FormLabel>
                            <FormControl>
                              <TimeInput placeholder="Abertura" value={field.value || ""} onValueChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="fridayClose"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Fechamento</FormLabel>
                            <FormControl>
                              <TimeInput placeholder="Fechamento" value={field.value || ""} onValueChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Sábado */}
                    <div className="grid grid-cols-3 items-center gap-4">
                      <div className="font-medium">Sábado</div>
                      <FormField
                        control={form.control}
                        name="saturdayOpen"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Abertura</FormLabel>
                            <FormControl>
                              <TimeInput placeholder="Abertura" value={field.value || ""} onValueChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="saturdayClose"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Fechamento</FormLabel>
                            <FormControl>
                              <TimeInput placeholder="Fechamento" value={field.value || ""} onValueChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Domingo */}
                    <div className="grid grid-cols-3 items-center gap-4">
                      <div className="font-medium">Domingo</div>
                      <FormField
                        control={form.control}
                        name="sundayOpen"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Abertura</FormLabel>
                            <FormControl>
                              <TimeInput placeholder="Fechado" value={field.value || ""} onValueChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="sundayClose"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Fechamento</FormLabel>
                            <FormControl>
                              <TimeInput placeholder="Fechado" value={field.value || ""} onValueChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button type="button" variant="outline" onClick={() => setActiveTab("endereco")}>
                        Voltar
                      </Button>
                      <Button type="submit" disabled={isSubmitting} className="gap-2">
                        {isSubmitting ? (
                          <>Salvando...</>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Salvar Estabelecimento
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </div>
    </PrestadorLayout>
  )
}
