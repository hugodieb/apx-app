import { apiClient } from "./client"

export interface LoginResponse {
  user: {
    email: string
    name: string
    type: string
  }
}

export interface RegisterFormData {
  user: {
    name: string
    email: string
    password: string
    type: string
  }
}

export const login = async (email: string, password: string, type: string): Promise<LoginResponse> => {
  return apiClient.post<LoginResponse>("/auth/login/", { email, password })
}

export const register = async (formData: RegisterFormData): Promise<RegisterFormData> => {
  return apiClient.post<RegisterFormData>("/auth/register/", formData)
}

export const logout = async () => {
  return apiClient.post("/auth/logout/", null)
}