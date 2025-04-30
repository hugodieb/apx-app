"use client"

import { type ReactNode, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuthStore } from "@/store/auth"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Bell,
  Home,
  LogOut,
  Menu,
  Settings,
  Shield,
  User,
  Users,
  X,
  HelpCircle,
  FileText,
  Globe,
} from "lucide-react"

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home },
    { name: "Usuários", href: "/admin/usuarios", icon: Users },
    { name: "Prestadores", href: "/admin/prestadores", icon: User },
    { name: "Relatórios", href: "/admin/relatorios", icon: BarChart3 },
    { name: "Configurações", href: "/admin/configuracoes", icon: Settings },
    { name: "Integrações", href: "/admin/integracoes", icon: Globe },
    { name: "Documentação", href: "/admin/documentacao", icon: FileText },
    { name: "Suporte", href: "/admin/suporte", icon: HelpCircle },
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-slate-900 border-b border-slate-800 p-4">
        <div className="flex items-center justify-between">
          <Link href="/admin/dashboard" className="text-xl font-bold text-blue-500 flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Apx Admin
          </Link>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-20 bg-slate-900/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 z-30 w-64 bg-slate-800 p-4 pt-20 overflow-y-auto">
            <nav className="flex flex-col space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md ${isActive ? "bg-blue-700 text-white" : "text-slate-300 hover:bg-slate-700"
                      }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
              <button
                onClick={() => {
                  logout()
                  setIsSidebarOpen(false)
                }}
                className="flex items-center px-3 py-2 mt-4 text-slate-300 hover:bg-slate-700 rounded-md"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sair
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:bg-slate-800 lg:border-r lg:border-slate-700">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
          <div className="flex items-center justify-center px-4">
            <Link href="/admin/dashboard" className="text-2xl font-bold text-blue-500 flex items-center">
              <Shield className="mr-2 h-6 w-6" />
              Apx Admin
            </Link>
          </div>
          <div className="mt-8 flex flex-col flex-grow">
            <nav className="flex-1 px-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md ${isActive ? "bg-blue-700 text-white" : "text-slate-300 hover:bg-slate-700"
                      }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
            <div className="p-4">
              <div className="border-t border-slate-700 pt-4">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-slate-400">Administrador</p>
                  </div>
                </div>
                <Button
                  onClick={logout}
                  variant="outline"
                  className="w-full border-slate-700 text-slate-300 hover:bg-slate-700"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 pt-16 lg:pt-0">{children}</div>
    </div>
  )
}
