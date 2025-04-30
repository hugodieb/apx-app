"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth"
import { mockUsers } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, DollarSign, Download, Plus, RefreshCw, Search, Settings, User, Users } from "lucide-react"
import { AdminLayout } from "@/components/dashboard/admin/admin-layout"
import { Input } from "@/components/ui/input"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "admin") {
      router.push("/admin/login")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.type !== "admin") {
    return null
  }

  // Estatísticas
  const totalClientes = mockUsers.clientes.length
  const totalPrestadores = mockUsers.prestadores.length
  const totalUsuarios = totalClientes + totalPrestadores
  const faturamentoMensal = 12500

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold">Painel Administrativo</h1>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm" className="border-slate-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button variant="outline" size="sm" className="border-slate-700">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button size="sm" className="bg-blue-700 hover:bg-blue-800">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total de Usuários</p>
                  <p className="text-2xl font-bold">{totalUsuarios}</p>
                </div>
                <div className="p-2 bg-blue-900/50 rounded-full">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Clientes</p>
                  <p className="text-2xl font-bold">{totalClientes}</p>
                </div>
                <div className="p-2 bg-orange-900/50 rounded-full">
                  <User className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Prestadores</p>
                  <p className="text-2xl font-bold">{totalPrestadores}</p>
                </div>
                <div className="p-2 bg-green-900/50 rounded-full">
                  <Users className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Faturamento Mensal</p>
                  <p className="text-2xl font-bold">R$ {faturamentoMensal}</p>
                </div>
                <div className="p-2 bg-purple-900/50 rounded-full">
                  <DollarSign className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">Visão Geral</CardTitle>
              <Button variant="outline" size="sm" className="border-slate-700">
                <BarChart3 className="h-4 w-4 mr-2" />
                Ver Relatórios
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-slate-700/50 rounded-lg">
                <p className="text-slate-400">Gráfico de estatísticas seria exibido aqui</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 hover:bg-slate-700 rounded-lg">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${index % 3 === 0 ? "bg-blue-700" : index % 3 === 1 ? "bg-orange-700" : "bg-green-700"
                        }`}
                    >
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {index % 3 === 0
                          ? "Novo cliente registrado"
                          : index % 3 === 1
                            ? "Novo prestador aprovado"
                            : "Configuração atualizada"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(Date.now() - index * 3600000).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">Gerenciamento de Prestadores</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    type="search"
                    placeholder="Buscar prestadores..."
                    className="pl-8 bg-slate-700 border-slate-600 w-[250px]"
                  />
                </div>
                <Button className="bg-blue-700 hover:bg-blue-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 font-medium text-slate-300">Nome</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-300">Serviço</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-300">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-300">Avaliação</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-300">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUsers.prestadores.map((prestador, index) => (
                      <tr key={index} className="border-b border-slate-700">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
                              <User className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">{prestador.name}</p>
                              <p className="text-xs text-slate-400">{prestador.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p>{prestador.profession}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-900/30 text-green-500">Ativo</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <span className="mr-1">{prestador.rating}</span>
                            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-8 border-slate-700">
                              Editar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-red-700 text-red-500 hover:bg-red-900/20"
                            >
                              Suspender
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
