import { mockasync } from "@/lib/utils/mockasync"
import { mockUsers } from "@/lib/mock-data"
import type { User } from "@/types/user"

export interface RegisterFormData {
  user: {
    name: string
    email: string
    password: string
    type: string
  }
}

export const whoami = async () => {
  return mockasync(mockUsers.clientes[0])
}

export const login = async (email: string, password: string, type: string): Promise<User> => {
  let foundUser = null
  debugger
  if (type === "cliente") {
    foundUser = mockUsers.clientes.find((u) => u.email === email && u.password === password)
  } else if (type === "prestador") {
    foundUser = mockUsers.prestadores.find((u) => u.email === email && u.password === password)
  } else if (type === "admin") {
    foundUser = mockUsers.admins.find((u) => u.email === email && u.password === password)
  }

  const { ...userWithoutPassword } = foundUser

  return mockasync(userWithoutPassword as User);
}

export const logout = async () => {
  return mockasync({})
}

export const register = async (formData: RegisterFormData) => {
  return mockasync(
    formData
  )
}

