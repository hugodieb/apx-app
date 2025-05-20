"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"

const cadastroSchema = z
  .object({
    name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
    confirmPassword: z.string().min(6, { message: "Confirme sua senha" }),
    type: z.enum(["cliente", "prestador", "admin"], { message: "Tipo inválido" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

type CadastroFormValues = z.infer<typeof cadastroSchema>

type Props = {
  type: "cliente" | "prestador" | "admin"
  title: string
  redirectToLogin: string
  backLink?: string
}

export function CadastroForm({ type, title, redirectToLogin, backLink = "/" }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register } = useAuth()

  const form = useForm<CadastroFormValues>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      type: type
    },
  })

  async function onSubmit(data: CadastroFormValues) {
    setIsSubmitting(true)
    setError(null)
    const { confirmPassword, ...resData } = data
    const registerData = {
      ...resData,
      type
    }
    try {
      register(registerData)
    } catch (err) {
      setError("Ocorreu um erro ao realizar o cadastro. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
          <CardDescription className="text-center">Crie sua conta para acessar a plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {["name", "email", "password", "confirmPassword"].map((fieldName) => (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={fieldName as keyof CadastroFormValues}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {{
                          name: "Nome Completo",
                          email: "Email",
                          password: "Senha",
                          confirmPassword: "Confirmar Senha",
                        }[fieldName]}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type={fieldName.includes("password") ? "password" : "text"}
                          placeholder={
                            {
                              name: "Seu nome completo",
                              email: "seu@email.com",
                              password: "******",
                              confirmPassword: "******",
                            }[fieldName]
                          }
                          {...field}
                          className="bg-slate-700 border-slate-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isSubmitting}>
                {isSubmitting ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center">
            Já tem uma conta?{" "}
            <Link href={redirectToLogin} className="text-orange-500 hover:underline">
              Entrar
            </Link>
          </div>
          <div className="text-sm text-center">
            <Link href={backLink} className="text-slate-400 hover:text-slate-300">
              Voltar para a página inicial
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
