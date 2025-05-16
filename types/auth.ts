export interface LoginParams {
  email: string
  password: string
}

export interface RegisterParams {
  name: string
  email: string
  password: string
  type: 'cliente' | 'prestador' | 'admin'
}

export interface RegisterFormData {
  user: RegisterParams
}
