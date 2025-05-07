export interface LoginParams {
  email: string
  password: string
  type?: string
}

export interface RegisterParams {
  name: string
  email: string
  password: string
  type: string
}

export interface RegisterFormData {
  user: RegisterParams
}
