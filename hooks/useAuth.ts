import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { authApi as api } from "@/lib/api-provider"
import { useAuthStore } from "@/store/auth"
import { useRouter } from "next/navigation"
import { User } from "@/types/user"
import { toast } from "sonner"

type LoginParams = {
  email: string
  password: string
  type?: string
}

type RegisterParams = {
  name: string
  email: string
  password: string
  type: string
}

const ROUTE_MAP = {
  cliente: "/cliente/dashboard",
  prestador: "/prestador/dashboard",
  admin: "/admin/dashboard"
}

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore.getState()

  const loginMutation = useMutation({
    mutationFn: async ({ email, password, type }: LoginParams) => {
      const response = await api.login(email, password, type)
      return response as User
    },
    onSuccess: (user: User) => {
      authStore.setUser(user)
      toast.success("Login realizado com sucesso")
      const redirectRoute = ROUTE_MAP[user.type] || "/"
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
      return response as User
    },
    onSuccess: (user) => {
      const redirectRoute = ROUTE_MAP[user.type] || "/"
      toast.success("Cadastro realizado com sucesso")
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





