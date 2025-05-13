export type UserType = "cliente" | "prestador" | "admin"

type Address = {
  street?: string
  city?: string
  state?: string
  zipCode?: string
}

type SocialMedia = {
  instagram?: string
  facebook?: string
  whatsapp?: string
}

type Preferences = {
  notifications: boolean
  emailMarketing: boolean
  darkMode: boolean
  language: "pt-BR" | "en-US" | "es-ES"

}

type ServiceSettings = {
  service: {
    serviceType?: "hora" | "dia" | "servico" | "projeto"
    autoAcceptBookings?: boolean
    advanceBookingDays?: string
    cancellationPolicy?: "flexivel" | "moderada" | "rigorosa"
  }
}

export interface Settings {
  changePassword: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }
  preferences: {
    notifications: boolean
    emailMarketing: boolean
    darkMode: boolean
    language: "pt-BR" | "en-US" | "es-ES"
  }
  services: {
    serviceType?: "hora" | "dia" | "servico" | "projeto"
    autoAcceptBookings?: boolean
    advanceBookingDays?: string
    cancellationPolicy?: "flexivel" | "moderada" | "rigorosa"
  }
}

export interface Services {
  id: string
  name: string
  price: number
  duration: number
}

export interface Profile {
  id: string
  name: string
  email: string
  phone?: string
  cpf?: string
  gender?: "masculino" | "feminino" | "outro" | "prefiro_nao_informar"
  avatar?: string
  profession?: string
  bio: string
  birthDate?: string
  address?: Address
  socialMedia?: SocialMedia
  type: UserType
}

export interface User {
  settings?: Settings
  profile?: Profile,
  services?: Services[]
}
