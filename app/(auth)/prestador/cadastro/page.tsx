import { CadastroForm } from "@/components/auth/cadastro-form"

export default function PrestadorCadastroPage() {
  return (
    <CadastroForm
      type="prestador"
      title="Cadastro de Prestador"
      redirectToLogin="/prestador/login"
      backLink="/"
    />
  )
}
