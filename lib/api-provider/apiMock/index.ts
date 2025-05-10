import { mockasync } from "@/lib/utils/mockasync"
import { mockUsers } from "@/lib/mock-data"
import { LoginParams, RegisterParams } from "@/types/auth"
import type { User, Profile, UserType } from "@/types/user"


export const whoami = async () => {
  return mockasync(mockUsers.clientes[0])
}

export const getUser = (params: LoginParams) => {
  let foundUser = null
  if (params.type === "cliente") {
    foundUser = mockUsers.clientes.find((u) => u.email === params.email && u.password === params.password)
  } else if (params.type === "prestador") {
    foundUser = mockUsers.prestadores.find((u) => u.email === params.email && u.password === params.password)
  } else if (params.type === "admin") {
    foundUser = mockUsers.admins.find((u) => u.email === params.email && u.password === params.password)
  }

  return foundUser
}

export const login = async (params: LoginParams): Promise<User> => {
  const loggedUser = getUser(params)

  if (loggedUser) {
    const userProfile = loggedUser as Partial<Profile>

    const profile: Profile = {
      id: userProfile.id || "ID não informado",
      name: userProfile.name || "Nome não informado",
      email: userProfile.email || "Email não informado",
      phone: userProfile.phone || "Telefone não informado",
      avatar: userProfile.avatar || undefined,
      address: userProfile.address || undefined,
      socialMedia: userProfile.socialMedia || undefined,
      cpf: userProfile.cpf || undefined,
      preferences: userProfile.preferences || {
        notifications: true,
        emailMarketing: false,
        darkMode: false,
        language: "pt-BR",
      },
      type: userProfile.type as UserType || "cliente",
    }

    const userWithProfile: User = {
      profile,
    }
    return mockasync(userWithProfile)
  }

  throw new Error("Invalid login credentials");
}

export const logout = async () => {
  return mockasync({})
}

export const register = async (formData: RegisterParams) => {
  const { name, email, password, type } = formData

  return mockasync({
    type,
  })

  throw new Error("Invalid register credentials");

}