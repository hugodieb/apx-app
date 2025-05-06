import { LoginForm } from '@/components/auth/login-form'

export default function ClienteLoginPage() {
  return (
    <LoginForm
      type="cliente"
      title="Login de Cliente"
      redirectToLogin="/cliente/cadastro"
      backLink="/"
    />
  )
}
