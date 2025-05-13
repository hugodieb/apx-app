import { mockasync } from "@/lib/utils/mockasync"
import { mockUsers } from "@/lib/mock-data"
import { LoginParams, RegisterParams } from "@/types/auth"
import { User, Profile, UserType, Settings, Services } from "@/types/user"


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
  debugger
  const loggedUser = getUser(params)

  if (loggedUser) {
    debugger
    const userProfile = loggedUser as Partial<Profile>
    const userSettings = loggedUser as Partial<Settings>
    const userServices = loggedUser as Partial<Services>


    const profile: Profile = {
      id: userProfile.id || "ID não informado",
      name: userProfile.name || "Nome não informado",
      email: userProfile.email || "Email não informado",
      phone: userProfile.phone || "Telefone não informado",
      avatar: userProfile.avatar || undefined,
      address: userProfile.address || undefined,
      socialMedia: userProfile.socialMedia || undefined,
      cpf: userProfile.cpf || undefined,
      birthDate: userProfile.birthDate || undefined,
      gender: userProfile.gender || undefined,
      bio: userProfile.bio || "",
      profession: userProfile.profession || undefined,
      type: userProfile.type as UserType || "cliente",
    }

    const settings: Settings = {
      changePassword: {
        currentPassword: userSettings.changePassword?.currentPassword || "",
        newPassword: userSettings.changePassword?.newPassword || "",
        confirmPassword: userSettings.changePassword?.confirmPassword || ""
      },
      preferences: {
        notifications: userSettings.preferences?.notifications || false,
        emailMarketing: userSettings.preferences?.emailMarketing || false,
        darkMode: userSettings.preferences?.darkMode || false,
        language: userSettings.preferences?.language || "pt-BR"
      },
      services: {
        serviceType: userSettings.services?.serviceType || "hora",
        autoAcceptBookings: userSettings.services?.autoAcceptBookings || false,
        advanceBookingDays: userSettings.services?.advanceBookingDays || "0",
        cancellationPolicy: userSettings.services?.cancellationPolicy || "flexivel"
      }
    }

    const services: Services[] = [
      {
        id: userServices.id || "ID não informado",
        name: userServices.name || "Nome do serviço não informado",
        price: userServices.price || 0,
        duration: userServices.duration || 0
      },
      {
        id: userServices.id || "ID não informado",
        name: userServices.name || "Nome do serviço não informado",
        price: userServices.price || 0,
        duration: userServices.duration || 0
      },
      {
        id: userServices.id || "ID não informado",
        name: userServices.name || "Nome do serviço não informado",
        price: userServices.price || 0,
        duration: userServices.duration || 0
      }
    ]

    const userWithProfile: User = {
      profile, settings, services
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