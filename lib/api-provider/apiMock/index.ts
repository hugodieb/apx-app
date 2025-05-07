import { mockasync } from "@/lib/utils/mockasync"
import { mockUsers } from "@/lib/mock-data"
import { LoginParams, RegisterParams } from "@/types/auth"
import type { User } from "@/types/user"


export const whoami = async () => {
  return mockasync(mockUsers.clientes[0])
}

export const login = async (params: LoginParams): Promise<User> => {
  let foundUser = null
  if (params.type === "cliente") {
    foundUser = mockUsers.clientes.find((u) => u.email === params.email && u.password === params.password)
  } else if (params.type === "prestador") {
    foundUser = mockUsers.prestadores.find((u) => u.email === params.email && u.password === params.password)
  } else if (params.type === "admin") {
    foundUser = mockUsers.admins.find((u) => u.email === params.email && u.password === params.password)
  }

  const { ...userWithoutPassword } = foundUser

  return mockasync(userWithoutPassword as User);
}

export const logout = async () => {
  return mockasync({})
}

export const register = async (formData: RegisterParams): Promise<User> => {
  return mockasync(
    { ...formData } as User
  )
}

