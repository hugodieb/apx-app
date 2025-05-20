import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryClientProviderWrapper } from "@/components/providers/query-client-provider";
import { WhoAmISync } from "@/components/auth/WhoAmiSync"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Apx App - Gerenciamento de Serviços",
  description: "A maneira mais fácil de gerenciar seus serviços e clientes.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryClientProviderWrapper>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <WhoAmISync />
            {children}
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </QueryClientProviderWrapper>
      </body>
    </html>
  )
}
