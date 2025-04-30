import { Calendar, MessageSquare, MapPin, Star, Clock, Shield } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: <Calendar className="h-10 w-10 text-orange-500" />,
      title: "Agendamento Simplificado",
      description: "Agende serviços com poucos cliques, sem complicações.",
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-orange-500" />,
      title: "Chat Integrado",
      description: "Comunique-se diretamente com prestadores de serviço.",
    },
    {
      icon: <MapPin className="h-10 w-10 text-orange-500" />,
      title: "Geolocalização",
      description: "Encontre serviços próximos à sua localização.",
    },
    {
      icon: <Star className="h-10 w-10 text-orange-500" />,
      title: "Avaliações",
      description: "Veja avaliações de outros clientes antes de agendar.",
    },
    {
      icon: <Clock className="h-10 w-10 text-orange-500" />,
      title: "Gestão de Tempo",
      description: "Prestadores podem gerenciar sua agenda com eficiência.",
    },
    {
      icon: <Shield className="h-10 w-10 text-orange-500" />,
      title: "Segurança",
      description: "Seus dados estão protegidos com nossa plataforma segura.",
    },
  ]

  return (
    <section className="py-16" id="features">
      <h2 className="text-3xl font-bold text-center mb-12">Nossos Recursos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-slate-800 p-6 rounded-lg shadow-lg hover:shadow-blue-900/20 transition-all">
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-slate-300">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
