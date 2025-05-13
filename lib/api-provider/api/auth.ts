import { apiClient } from "./client"
import { LoginParams, RegisterParams } from "@/types/auth"
import { User, UserType } from "@/types/user"


export const login = async (params: LoginParams): Promise<User> => {
  const response = await apiClient.post<{ user: User }>("/auth/login/", params)
  return response.user
}

export const register = async (formData: RegisterParams): Promise<{ type: UserType }> => {
  const response = await apiClient.post("/auth/register/", formData)
  return response as { type: UserType }
}

export const logout = async () => {
  return apiClient.post("/auth/logout/", null)
}