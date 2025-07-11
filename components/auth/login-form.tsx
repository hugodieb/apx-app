"use client"

import { useState } from "react"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { Loader2 } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

type Props = {
  type: "cliente" | "prestador" | "admin"
  title: string
  redirectToLogin: string
  backLink?: string
}

export function LoginForm({ type, title, redirectToLogin, backLink = "/" }: Props) {
  const [error, setError] = useState<string | null>(null)
  const { login, isLoginPending } = useAuth()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setError(null)
    try {
      login({
        email: data.email,
        password: data.password
      })
    } catch (err) {
      setError("Ocorreu um erro ao fazer login. Tente novamente.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
          <CardDescription className="text-center">Entre com suas credenciais para acessar sua conta</CardDescription>
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
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} className="bg-slate-700 border-slate-600" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="******"
                        {...field}
                        className="bg-slate-700 border-slate-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoginPending}>
                {isLoginPending ? <Loader2 className="animate-spin" /> : "Entrar"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center">
            <Link href="/cliente/recuperar-senha" className="text-orange-500 hover:underline">
              Esqueceu sua senha?
            </Link>
          </div>
          <div className="text-sm text-center">
            Não tem uma conta?{" "}
            <Link href={redirectToLogin} className="text-orange-500 hover:underline">
              Cadastre-se
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
