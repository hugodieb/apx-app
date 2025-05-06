import { CadastroForm } from "@/components/auth/cadastro-form"

export default function ClienteCadastroPage() {
  return (
    <CadastroForm
      type="cliente"
      title="Cadastro de Cliente"
      redirectToLogin="/cliente/login"
      backLink="/"
    />
  )
}
