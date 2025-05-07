import { apiClient } from "./client"
import { LoginParams, RegisterParams } from "@/types/auth"
import { User } from "@/types/user"


export const login = async (params: LoginParams): Promise<User> => {
  const response = await apiClient.post<{ user: User }>("/auth/login/", params)
  return response.user

}

export const register = async (formData: RegisterParams): Promise<User> => {
  const response = await apiClient.post<{ user: User }>("/auth/register/", formData)
  return response.user
}

export const logout = async () => {
  return apiClient.post("/auth/logout/", null)
}