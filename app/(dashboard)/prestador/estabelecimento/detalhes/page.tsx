"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { usePrestadorAuth } from "@/store/auth"
import { PrestadorLayout } from "@/components/dashboard/prestador/prestador-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Calendar, Clock, Edit, MapPin, Phone, Star, Trash } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function DetalhesEstabelecimentoPage() {
  const router = useRouter()
  const { user } = usePrestadorAuth()
  const [isLoading, setIsLoading] = useState(true)

  // Simulando o carregamento de dados do estabelecimento
  const [establishment, setEstablishment] = useState<any>(null)

  useEffect(() => {
    // Simulando uma chamada de API para buscar os dados do estabelecimento
    const fetchEstablishment = async () => {
      setIsLoading(true)
      try {
        // Simulando um atraso de rede
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Dados mockados do estabelecimento
        const mockEstablishment = {
          id: "estab1",
          name: "Barbearia Vintage",
          description: "Barbearia especializada em cortes clássicos e modernos",
          address: {
            street: "Av. Paulista, 1000",
            city: "São Paulo",
            state: "SP",
            zipCode: "01310-100",
          },
          phone: "(11) 3456-7890",
          image: "/placeholder.svg?height=400&width=600",
          category: "Barbearia",
          rating: 4.8,
          openingHours: {
            monday: { open: "09:00", close: "19:00" },
            tuesday: { open: "09:00", close: "19:00" },
            wednesday: { open: "09:00", close: "19:00" },
            thursday: { open: "09:00", close: "19:00" },
            friday: { open: "09:00", close: "19:00" },
            saturday: { open: "09:00", close: "17:00" },
            sunday: { open: "", close: "" }, // Fechado
          },
        }

        setEstablishment(mockEstablishment)
      } catch (error) {
        console.error("Erro ao buscar dados do estabelecimento:", error)
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do estabelecimento.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEstablishment()
  }, [])

  const handleEdit = () => {
    router.push("/prestador/estabelecimento/editar")
  }

  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja excluir este estabelecimento? Esta ação não pode ser desfeita.")) {
      try {
        // Simulando uma chamada de API para excluir o estabelecimento
        await new Promise((resolve) => setTimeout(resolve, 1000))

        toast({
          title: "Estabelecimento excluído",
          description: "Seu estabelecimento foi excluído com sucesso.",
        })

        router.push("/prestador/dashboard")
      } catch (error) {
        console.error("Erro ao excluir estabelecimento:", error)
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir o estabelecimento. Tente novamente.",
          variant: "destructive",
        })
      }
    }
  }

  if (isLoading) {
    return (
      <PrestadorLayout>
        <div className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="h-8 w-48 bg-slate-200 rounded animate-pulse dark:bg-slate-700"></div>
              <div className="h-4 w-64 bg-slate-200 rounded animate-pulse mt-2 dark:bg-slate-700"></div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="h-64 bg-slate-200 rounded animate-pulse dark:bg-slate-700"></div>
            <div className="grid gap-4">
              <div className="h-8 w-32 bg-slate-200 rounded animate-pulse dark:bg-slate-700"></div>
              <div className="h-24 bg-slate-200 rounded animate-pulse dark:bg-slate-700"></div>
            </div>
          </div>
        </div>
      </PrestadorLayout>
    )
  }

  if (!establishment) {
    return (
      <PrestadorLayout>
        <div className="container py-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Nenhum estabelecimento encontrado</h2>
            <p className="text-muted-foreground mb-6">Você ainda não possui um estabelecimento cadastrado.</p>
            <Button onClick={() => router.push("/prestador/estabelecimento/novo")}>Cadastrar Estabelecimento</Button>
          </div>
        </div>
      </PrestadorLayout>
    )
  }

  return (
    <PrestadorLayout>
      <div className="container py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">{establishment.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Badge variant="outline">{establishment.category}</Badge>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span>{establishment.rating}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit} className="gap-2">
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="gap-2">
              <Trash className="h-4 w-4" />
              Excluir
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Imagem do estabelecimento */}
          <div className="aspect-video overflow-hidden rounded-lg border">
            <img
              src={establishment.image || "/placeholder.svg"}
              alt={establishment.name}
              className="h-full w-full object-cover"
            />
          </div>

          <Tabs defaultValue="informacoes">
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

            {/* Tab de Informações */}
            <TabsContent value="informacoes">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Estabelecimento</CardTitle>
                  <CardDescription>Detalhes gerais sobre seu estabelecimento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Descrição</h3>
                    <p className="text-muted-foreground">{establishment.description}</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-1">Telefone</h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{establishment.phone}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-1">Categoria</h3>
                    <Badge variant="secondary">{establishment.category}</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab de Endereço */}
            <TabsContent value="endereco">
              <Card>
                <CardHeader>
                  <CardTitle>Endereço</CardTitle>
                  <CardDescription>Localização do seu estabelecimento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Endereço Completo</h3>
                    <p className="text-muted-foreground">{establishment.address.street}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h3 className="font-medium mb-1">Cidade</h3>
                      <p className="text-muted-foreground">{establishment.address.city}</p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-1">Estado</h3>
                      <p className="text-muted-foreground">{establishment.address.state}</p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-1">CEP</h3>
                      <p className="text-muted-foreground">{establishment.address.zipCode}</p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="aspect-video rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">Mapa indisponível</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab de Horários */}
            <TabsContent value="horarios">
              <Card>
                <CardHeader>
                  <CardTitle>Horários de Funcionamento</CardTitle>
                  <CardDescription>Horários em que seu estabelecimento está aberto</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 py-2 border-b">
                      <div className="font-medium">Dia</div>
                      <div className="font-medium">Abertura</div>
                      <div className="font-medium">Fechamento</div>
                    </div>

                    <div className="grid grid-cols-3 py-2 border-b">
                      <div>Segunda-feira</div>
                      <div>{establishment.openingHours.monday.open || "Fechado"}</div>
                      <div>{establishment.openingHours.monday.close || "Fechado"}</div>
                    </div>

                    <div className="grid grid-cols-3 py-2 border-b">
                      <div>Terça-feira</div>
                      <div>{establishment.openingHours.tuesday.open || "Fechado"}</div>
                      <div>{establishment.openingHours.tuesday.close || "Fechado"}</div>
                    </div>

                    <div className="grid grid-cols-3 py-2 border-b">
                      <div>Quarta-feira</div>
                      <div>{establishment.openingHours.wednesday.open || "Fechado"}</div>
                      <div>{establishment.openingHours.wednesday.close || "Fechado"}</div>
                    </div>

                    <div className="grid grid-cols-3 py-2 border-b">
                      <div>Quinta-feira</div>
                      <div>{establishment.openingHours.thursday.open || "Fechado"}</div>
                      <div>{establishment.openingHours.thursday.close || "Fechado"}</div>
                    </div>

                    <div className="grid grid-cols-3 py-2 border-b">
                      <div>Sexta-feira</div>
                      <div>{establishment.openingHours.friday.open || "Fechado"}</div>
                      <div>{establishment.openingHours.friday.close || "Fechado"}</div>
                    </div>

                    <div className="grid grid-cols-3 py-2 border-b">
                      <div>Sábado</div>
                      <div>{establishment.openingHours.saturday.open || "Fechado"}</div>
                      <div>{establishment.openingHours.saturday.close || "Fechado"}</div>
                    </div>

                    <div className="grid grid-cols-3 py-2">
                      <div>Domingo</div>
                      <div>{establishment.openingHours.sunday.open || "Fechado"}</div>
                      <div>{establishment.openingHours.sunday.close || "Fechado"}</div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button variant="outline" className="gap-2">
                      <Calendar className="h-4 w-4" />
                      Gerenciar Disponibilidade
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PrestadorLayout>
  )
}
