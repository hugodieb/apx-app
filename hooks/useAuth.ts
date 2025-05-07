import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { authApi as api } from "@/lib/api-provider"
import { useAuthStore } from "@/store/auth"
import { useRouter } from "next/navigation"
import type { LoginParams, RegisterParams } from "@/types/auth"
import { toast } from "sonner"


const ROUTE_DASHBOARD = {
  cliente: "/cliente/dashboard",
  prestador: "/prestador/dashboard",
  admin: "/admin/dashboard"
}

const ROUTE_LOGIN = {
  cliente: "/cliente/login",
  prestador: "/prestador/login",
  admin: "/admin/login"
}

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore.getState()

  const loginMutation = useMutation({
    mutationFn: async (params: LoginParams) => {
      const response = await api.login(params)
      return response
    },
    onSuccess: (user) => {
      authStore.setUser(user)
      toast.success("Login realizado com sucesso")
      const redirectRoute = ROUTE_DASHBOARD[user.type] || "/"
      router.push(redirectRoute)
    },
    onError: (error: any) => {
      authStore.logout()
      toast.error("Usuário e ou senha errados.")
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await api.logout()
      return response
    },
    onSuccess: () => {
      authStore.logout()
      toast.success("Logout realizado com sucesso")
      router.push("/")
    },
    onError: (error: any) => {
      authStore.logout()
      toast.error("Erro ao fazer logout")
    },
  })

  const useRegisterMutation = useMutation({
    mutationFn: async (formData: RegisterParams) => {
      const response = await api.register(formData)
      return response
    },
    onSuccess: (user) => {
      const redirectRoute = ROUTE_LOGIN[user.type] || "/"
      toast.success("Cadastro realizado com sucesso")
      router.push(redirectRoute)
    },
    onError: (error: any) => {
      toast.error("Erro ao realizar cadastro")
    }
  })

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    register: useRegisterMutation.mutate,
  }
}





