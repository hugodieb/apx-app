// Endereço comum a todos
export type Address = {
  street: string
  city: string
  state: string
  zipCode: string
}

// Cliente
export type Cliente = {
  id: string
  email: string
  password: string
  name: string
  phone: string
  avatar: string
  address: Address
  type: "cliente"
}

// Prestador
export type Prestador = {
  id: string
  email: string
  password: string
  name: string
  phone: string
  avatar: string
  address: Address
  services: string[]
  available: boolean
  type: "prestador"
}

// Admin
export type Admin = {
  id: string
  email: string
  password: string
  name: string
  phone: string
  avatar: string
  address: Address
  type: "admin"
}

export type User = Cliente | Prestador | Admin
