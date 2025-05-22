import { BaseUser } from "@/types/user"
import { apiClient } from "./client"
import { appointment } from "@/types/appointment"


export const appointments = async (params: BaseUser) => {
  const response = await apiClient.get<appointment[]>("provider/appointment/", params)
  return response
}