// Usuários mock para login
export const mockUsers = {
  clientes: [
    {
      id: "cliente1",
      email: "cliente@example.com",
      password: "Cliente123",
      name: "Maria Silva",
      phone: "(11) 98765-4321",
      avatar: "/placeholder.svg?height=200&width=200",
      cpf: "123.456.789-00",
      address: {
        street: "Rua das Flores, 123",
        city: "São Paulo",
        state: "SP",
        zipCode: "01234-567",
      },
      type: "cliente",
    },
  ],
  prestadores: [
    {
      id: "prestador1",
      email: "prestador@example.com",
      password: "Prestador123",
      name: "João Barbeiro",
      phone: "(11) 91234-5678",
      avatar: "/placeholder.svg?height=200&width=200",
      cpf: "987.654.321-00",
      address: {
        street: "Av. Paulista, 1000",
        city: "São Paulo",
        state: "SP",
        zipCode: "01310-100",
      },
      type: "prestador",
      profession: "Barbeiro",
      establishmentId: "estab1", // Referência ao estabelecimento
      serviceType: "hora", // Tipo de serviço: hora, dia, serviço, projeto
      services: [
        { id: "s1", name: "Corte de Cabelo", price: 50, duration: 30 },
        { id: "s2", name: "Barba", price: 30, duration: 20 },
        { id: "s3", name: "Corte + Barba", price: 70, duration: 45 },
      ],
      rating: 4.8,
      socialMedia: {
        instagram: "@joaobarbeiro",
        facebook: "joaobarbeiro",
        whatsapp: "(11) 91234-5678",
      },
    },
    {
      id: "prestador2",
      email: "pedro@example.com",
      password: "Prestador123",
      name: "Pedro Barbeiro",
      phone: "(11) 92345-6789",
      avatar: "/placeholder.svg?height=200&width=200",
      profession: "Barbeiro",
      address: {
        street: "Av. Paulista, 1000",
        city: "São Paulo",
        state: "SP",
        zipCode: "01310-100",
      },
      establishmentId: "estab1", // Mesmo estabelecimento que João
      serviceType: "hora",
      services: [
        { id: "s4", name: "Corte Moderno", price: 60, duration: 40 },
        { id: "s5", name: "Barba Completa", price: 35, duration: 25 },
        { id: "s6", name: "Pacote Completo", price: 85, duration: 60 },
      ],
      rating: 4.6,
      socialMedia: {
        instagram: "@pedrobarbeiro",
        facebook: "pedrobarbeiro",
        whatsapp: "(11) 92345-6789",
      },
      type: "prestador",
    },
    {
      id: "prestador3",
      email: "ana@example.com",
      password: "Prestador123",
      name: "Ana Limpeza",
      phone: "(11) 93456-7890",
      avatar: "/placeholder.svg?height=200&width=200",
      profession: "Faxineira",
      address: {
        street: "Rua Augusta, 500",
        city: "São Paulo",
        state: "SP",
        zipCode: "01305-000",
      },
      establishmentId: "estab2",
      serviceType: "dia",
      services: [
        { id: "s7", name: "Limpeza Residencial", price: 150, duration: 480 }, // 8 horas
        { id: "s8", name: "Limpeza Comercial", price: 200, duration: 480 },
        { id: "s9", name: "Limpeza Pós-Obra", price: 300, duration: 960 }, // 16 horas (2 dias)
      ],
      rating: 4.9,
      socialMedia: {
        instagram: "@analimpeza",
        whatsapp: "(11) 93456-7890",
      },
      type: "prestador",
    },
    {
      id: "prestador4",
      email: "carlos@example.com",
      password: "Prestador123",
      name: "Carlos Eletricista",
      phone: "(11) 94567-8901",
      avatar: "/placeholder.svg?height=200&width=200",
      profession: "Eletricista",
      address: {
        street: "Rua Consolação, 800",
        city: "São Paulo",
        state: "SP",
        zipCode: "01301-000",
      },
      establishmentId: "estab3",
      serviceType: "servico",
      services: [
        { id: "s10", name: "Instalação de Tomadas", price: 80, duration: 60 },
        { id: "s11", name: "Troca de Disjuntores", price: 120, duration: 90 },
        { id: "s12", name: "Instalação de Ventilador", price: 150, duration: 120 },
      ],
      rating: 4.7,
      socialMedia: {
        facebook: "carloseletricista",
        whatsapp: "(11) 94567-8901",
      },
      type: "prestador",
    },
    {
      id: "prestador5",
      email: "roberto@example.com",
      password: "Prestador123",
      name: "Roberto Engenheiro",
      phone: "(11) 95678-9012",
      avatar: "/placeholder.svg?height=200&width=200",
      profession: "Engenheiro Civil",
      address: {
        street: "Av. Rebouças, 1200",
        city: "São Paulo",
        state: "SP",
        zipCode: "05402-000",
      },
      establishmentId: "estab4",
      serviceType: "projeto",
      services: [
        { id: "s13", name: "Projeto Residencial", price: 5000, duration: 4320 }, // 3 dias (72 horas)
        { id: "s14", name: "Laudo Técnico", price: 1500, duration: 2880 }, // 2 dias (48 horas)
        { id: "s15", name: "Consultoria", price: 800, duration: 120 }, // 2 horas
      ],
      rating: 4.9,
      socialMedia: {
        instagram: "@robertoengenheiro",
        facebook: "robertoengenheiro",
        whatsapp: "(11) 95678-9012",
      },
      type: "prestador",
    },
  ],
  admins: [
    {
      id: "admin1",
      email: "admin@example.com",
      password: "Admin123",
      name: "Admin User",
      role: "superadmin",
      type: "admin",
    },
  ],
}

// Estabelecimentos
export const mockEstablishments = [
  {
    id: "estab1",
    name: "Barbearia Vintage",
    description: "Barbearia especializada em cortes clássicos e modernos",
    address: {
      street: "Av. Paulista, 1000",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-100",
    },
    phone: "(11) 3456-7890",
    image: "/placeholder.svg?height=400&width=600",
    category: "Barbearia",
    rating: 4.8,
    openingHours: {
      monday: { open: "09:00", close: "19:00" },
      tuesday: { open: "09:00", close: "19:00" },
      wednesday: { open: "09:00", close: "19:00" },
      thursday: { open: "09:00", close: "19:00" },
      friday: { open: "09:00", close: "19:00" },
      saturday: { open: "09:00", close: "17:00" },
      sunday: { open: "", close: "" }, // Fechado
    },
  },
  {
    id: "estab2",
    name: "Limpeza Express",
    description: "Serviços de limpeza residencial e comercial",
    address: {
      street: "Rua Augusta, 500",
      city: "São Paulo",
      state: "SP",
      zipCode: "01305-000",
    },
    phone: "(11) 2345-6789",
    image: "/placeholder.svg?height=400&width=600",
    category: "Limpeza",
    rating: 4.7,
    openingHours: {
      monday: { open: "08:00", close: "18:00" },
      tuesday: { open: "08:00", close: "18:00" },
      wednesday: { open: "08:00", close: "18:00" },
      thursday: { open: "08:00", close: "18:00" },
      friday: { open: "08:00", close: "18:00" },
      saturday: { open: "08:00", close: "12:00" },
      sunday: { open: "", close: "" }, // Fechado
    },
  },
  {
    id: "estab3",
    name: "Eletricidade Segura",
    description: "Serviços elétricos residenciais e comerciais",
    address: {
      street: "Rua Consolação, 800",
      city: "São Paulo",
      state: "SP",
      zipCode: "01301-000",
    },
    phone: "(11) 3456-7891",
    image: "/placeholder.svg?height=400&width=600",
    category: "Elétrica",
    rating: 4.6,
    openingHours: {
      monday: { open: "08:00", close: "18:00" },
      tuesday: { open: "08:00", close: "18:00" },
      wednesday: { open: "08:00", close: "18:00" },
      thursday: { open: "08:00", close: "18:00" },
      friday: { open: "08:00", close: "18:00" },
      saturday: { open: "08:00", close: "13:00" },
      sunday: { open: "", close: "" }, // Fechado
    },
  },
  {
    id: "estab4",
    name: "Engenharia Moderna",
    description: "Projetos e consultorias em engenharia civil",
    address: {
      street: "Av. Rebouças, 1200",
      city: "São Paulo",
      state: "SP",
      zipCode: "05402-000",
    },
    phone: "(11) 3456-7892",
    image: "/placeholder.svg?height=400&width=600",
    category: "Engenharia",
    rating: 4.9,
    openingHours: {
      monday: { open: "09:00", close: "18:00" },
      tuesday: { open: "09:00", close: "18:00" },
      wednesday: { open: "09:00", close: "18:00" },
      thursday: { open: "09:00", close: "18:00" },
      friday: { open: "09:00", close: "18:00" },
      saturday: { open: "", close: "" }, // Fechado
      sunday: { open: "", close: "" }, // Fechado
    },
  },
]

// Agendamentos mock
export const mockAppointments = [
  {
    id: "a1",
    clientId: "cliente1",
    providerId: "prestador1",
    establishmentId: "estab1",
    serviceId: "s1",
    date: "2025-04-25T14:00:00",
    status: "confirmed",
    price: 50,
  },
  {
    id: "a2",
    clientId: "cliente1",
    providerId: "prestador1",
    establishmentId: "estab1",
    serviceId: "s3",
    date: "2025-04-28T10:00:00",
    status: "pending",
    price: 70,
  },
  {
    id: "a3",
    clientId: "cliente1",
    providerId: "prestador3",
    establishmentId: "estab2",
    serviceId: "s7",
    date: "2025-04-30T08:00:00", // Dia inteiro
    status: "confirmed",
    price: 150,
  },
  {
    id: "a4",
    clientId: "cliente1",
    providerId: "prestador4",
    establishmentId: "estab3",
    serviceId: "s10",
    date: "2025-05-02T15:00:00",
    status: "pending",
    price: 80,
  },
  {
    id: "a5",
    clientId: "cliente1",
    providerId: "prestador5",
    establishmentId: "estab4",
    serviceId: "s14",
    date: "2025-05-05T09:00:00", // Projeto de 2 dias
    endDate: "2025-05-06T18:00:00",
    status: "confirmed",
    price: 1500,
  },
]

// Mensagens mock para o chat
export const mockMessages = [
  {
    id: "m1",
    senderId: "cliente1",
    receiverId: "prestador1",
    content: "Olá, gostaria de confirmar meu horário para amanhã.",
    timestamp: "2025-04-24T18:30:00",
    read: true,
  },
  {
    id: "m2",
    senderId: "prestador1",
    receiverId: "cliente1",
    content: "Olá Maria! Sim, está tudo confirmado para amanhã às 14h.",
    timestamp: "2025-04-24T18:35:00",
    read: true,
  },
  {
    id: "m3",
    senderId: "cliente1",
    receiverId: "prestador1",
    content: "Ótimo! Obrigada pela confirmação.",
    timestamp: "2025-04-24T18:37:00",
    read: true,
  },
]

// Avaliações mock
export const mockReviews = [
  {
    id: "r1",
    clientId: "cliente1",
    providerId: "prestador1",
    establishmentId: "estab1",
    serviceId: "s1",
    rating: 5,
    comment: "Excelente serviço! Recomendo a todos.",
    date: "2025-03-15T16:30:00",
  },
  {
    id: "r2",
    clientId: "cliente2",
    providerId: "prestador1",
    establishmentId: "estab1",
    serviceId: "s3",
    rating: 4,
    comment: "Muito bom atendimento, apenas um pouco de atraso.",
    date: "2025-03-20T11:45:00",
  },
]

// Bloqueios de horários
export const mockBlockedTimes = [
  {
    id: "b1",
    providerId: "prestador1",
    date: "2025-04-26",
    allDay: true,
    reason: "Folga",
    repeat: false,
  },
  {
    id: "b2",
    providerId: "prestador1",
    date: "2025-04-29",
    allDay: false,
    startTime: "14:00",
    endTime: "18:00",
    reason: "Compromisso pessoal",
    repeat: false,
  },
  {
    id: "b3",
    providerId: "prestador2",
    date: "2025-04-27",
    allDay: true,
    reason: "Folga",
    repeat: false,
  },
  {
    id: "b4",
    providerId: "prestador3",
    date: "2025-05-01",
    allDay: true,
    reason: "Feriado",
    repeat: false,
  },
]
