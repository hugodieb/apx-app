import { apiClient } from "./client"

export interface LoginResponse {
  access: string
  refresh: string
  user: {
    email: string
    name: string
    type: string
  }
}

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<LoginResponse>("/auth/login/", { email, password }),

  refresh: (refreshToken: string) =>
    apiClient.post<{ access: string }>("/auth/refresh/", { refresh: refreshToken }),
}


//export const login = async (email: string, password: string, type?: string) => {
//  const res = await axios.post("/auth/login/", { email, password, type })
//  return res.data
//}
//
//export const register = async (formData: any) => {
//  const res = await axios.post("/auth/register/", formData)
//  return res.data
//}
//
//export const whoami = async () => {
//  const res = await axios.get("/auth/whoami/")
//  return res.data
//}
//
//export const logout = async () => {
//  const res = await axios.post("/auth/logout/")
//  return res.data
//}