import { mockasync } from "@/lib/utils/mockasync"
import { mockUsers } from "@/lib/mock-data"
import { LoginParams, RegisterParams } from "@/types/auth"
import type { User, Profile } from "@/types/user"


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

  if (foundUser) {
    const usermock = foundUser as Partial<Profile>

    const profile: Profile = {
      name: usermock.name || "Nome não informado",
      email: usermock.email || "Email não informado",
      phone: usermock.phone || undefined,
      avatar: usermock.avatar || undefined,
      address: usermock.address || undefined,
      socialMedia: usermock.socialMedia || undefined,
      cpf: usermock.cpf || undefined,
      preferences: usermock.preferences || {
        notifications: true,
        emailMarketing: false,
        darkMode: false,
        language: "pt-BR",
      }
    }

    const { password: _, ...userWithoutPassword } = foundUser

    const userWithProfile: User = {
      ...userWithoutPassword,
      profile,
      type: params.type as User["type"],
    }
    return mockasync(userWithProfile)
  }

  throw new Error("Invalid login credentials");
}

export const logout = async () => {
  return mockasync({})
}

export const register = async (formData: RegisterParams): Promise<User> => {
  return mockasync(
    { ...formData, type: formData.type as User["type"] }
  )
}

