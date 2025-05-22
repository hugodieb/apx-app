import { BaseUser } from "@/types/user"
import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const apiClient = {
  get: <T>(url: string, params?: BaseUser) => api.get<T>(url, { params }).then(res => res.data),
  post: <T>(url: string, data: any) => api.post<T>(url, data).then(res => res.data),
  put: <T>(url: string, data: any) => api.put<T>(url, data).then(res => res.data),
  del: <T>(url: string) => api.delete<T>(url).then(res => res.data),
}
