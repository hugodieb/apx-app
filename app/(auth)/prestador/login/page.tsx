import { LoginForm } from '@/components/auth/login-form'

export default function PrestadorLoginPage() {
  return (
    <LoginForm
      type="prestador"
      title="Login de Prestador"
      redirectToLogin="/prestador/cadastro"
      backLink="/"
    />
  )
}
