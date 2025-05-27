import { BaseUser } from "@/types/user"
import { apiClient } from "./client"
import { appointment } from "@/types/appointment"


export const appointments = async (params: BaseUser) => {
  const response = await apiClient.get<appointment[]>("provider/appointment/", params)
  return response
}

export const updateAppointmentStatus = async (
  params: any
) => {
  const response = await apiClient.put<appointment>("provider/appontment/", params)
  return response
}

export const getClientAppointments = async (clientId: string) => {
  const response = await apiClient.get<appointment[]>(`provider/appointment/client/${clientId}`)
  return response
}