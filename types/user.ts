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

export interface Profile {
  name: string
  email: string
  phone?: string
  avatar?: string
  address?: Address
  socialMedia?: SocialMedia
  cpf?: string
  preferences?: Preferences
}

export interface User {
  id?: string
  email: string
  name: string
  type: UserType
  profile?: Profile
}

