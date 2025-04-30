import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { authApi as api } from "@/lib/api-provider"
import { useAuthStore } from "@/store/auth"
import { useRouter } from "next/navigation"
import { User } from "@/types/user"

type LoginParams = {
  email: string
  password: string
  type?: string
}

export function useAuth() {
  const router = useRouter()
  const loginMutation = useMutation({
    mutationFn: async ({ email, password, type }: LoginParams) => {
      const response = await api.login(email, password, type)
      return response
    },
    onSuccess: (response) => {
      console.log("user", response)
      useAuthStore.getState().setUser(response as User)
      router.push("/prestador/dashboard")
    },
  })

  const useRegisterMutation = useMutation({
    mutationFn: async (formData: any) => {
      const user = await api.register(formData)
      return user
    },
    onSuccess: (user) => {
      useAuthStore.getState().setUser(user)
    },
  })

  return {
    login: loginMutation.mutate,
    register: useRegisterMutation.mutate,
  }
}





