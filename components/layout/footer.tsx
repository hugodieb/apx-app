import Link from "next/link"
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Apx App</h3>
            <p className="mb-4">A maneira mais fácil de gerenciar seus serviços e clientes.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-orange-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-orange-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-orange-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-orange-500 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-orange-500 transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-orange-500 transition-colors">
                  Recursos
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-orange-500 transition-colors">
                  Serviços
                </Link>
              </li>
              <li>
                <Link href="#search" className="hover:text-orange-500 transition-colors">
                  Buscar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Acesso</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/cliente/login" className="hover:text-orange-500 transition-colors">
                  Login Cliente
                </Link>
              </li>
              <li>
                <Link href="/prestador/login" className="hover:text-orange-500 transition-colors">
                  Login Prestador
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-orange-500 transition-colors">
                  Login Admin
                </Link>
              </li>
              <li>
                <Link href="/cliente/cadastro" className="hover:text-orange-500 transition-colors">
                  Cadastro
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail size={16} className="mr-2" />
                <a href="mailto:contato@apxapp.com" className="hover:text-orange-500 transition-colors">
                  contato@apxapp.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2" />
                <a href="tel:+5511999999999" className="hover:text-orange-500 transition-colors">
                  (11) 99999-9999
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} Apx App. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
