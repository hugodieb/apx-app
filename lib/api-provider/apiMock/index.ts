import { mockUsers } from '@/lib/mock-data';
import { LoginParams } from '@/types/auth';
import { User } from '@/types/user';
import { mockasync } from '@/lib/utils/mockasync';

export const login = async (params: LoginParams): Promise<User> => {
  const { email, password } = params;

  const userCategories = ['clientes', 'prestadores', 'admins'] as const;
  let foundUser: User | undefined;

  for (const category of userCategories) {
    const user = mockUsers[category].find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      foundUser = user as unknown as User;
      break;
    }
  }

  if (!foundUser) {
    return mockasync<User>(null as unknown as User) as Promise<User>;
  }
  debugger
  const { password: _, ...userWithoutPassword } = foundUser as any;

  return mockasync<User>(userWithoutPassword as User);
}

export const logout = async (): Promise<void> => {
  return mockasync<void>(undefined)
}

// Logout
// logout: async (): Promise<void> => {
//   return mockAsync<void>(undefined);
// },
//
//   // Registro de cliente
//   registerCliente: async (data: RegisterClienteData): Promise<RegisterResponse> => {
//     // Verificar se o email já existe
//     const emailExists = Object.values(mockUsers).some(
//       (userCategory) => userCategory.some((user) => user.email === data.email)
//     );
//
//     if (emailExists) {
//       return mockAsync<RegisterResponse>(
//         {} as RegisterResponse,
//         500,
//         true
//       ) as Promise<RegisterResponse>;
//     }
//
//     // Criar novo cliente
//     const newClient = {
//       id: `cliente${mockUsers.clientes.length + 1}`,
//       ...data,
//       avatar: "/placeholder.svg?height=200&width=200",
//       type: 'cliente' as const
//     };
//
//     // Gerar token
//     const token = generateToken();
//
//     return mockAsync<RegisterResponse>({
//       user: newClient,
//       token
//     });
//   },
//
//     // Registro de prestador
//     registerPrestador: async (data: RegisterPrestadorData): Promise<RegisterResponse> => {
//       // Verificar se o email já existe
//       const emailExists = Object.values(mockUsers).some(
//         (userCategory) => userCategory.some((user) => user.email === data.email)
//       );
//
//       if (emailExists) {
//         return mockAsync<RegisterResponse>(
//           {} as RegisterResponse,
//           500,
//           true
//         ) as Promise<RegisterResponse>;
//       }
//
//       // Criar novo prestador
//       const newProvider = {
//         id: `prestador${mockUsers.prestadores.length + 1}`,
//         ...data,
//         avatar: "/placeholder.svg?height=200&width=200",
//         establishmentId: "",
//         serviceType: "",
//         services: [],
//         preferences: {
//           notifications: false,
//           emailMarketing: false,
//           darkMode: false,
//           language: "pt-BR"
//         },
//         settings: {
//           serviceType: "",
//           autoAcceptBookings: false,
//           advanceBookingDays: false,
//           cancellationPolicy: ""
//         },
//         rating: 0,
//         socialMedia: {
//           instagram: "",
//           facebook: "",
//           whatsapp: ""
//         },
//         type: 'prestador' as const
//       };
//
//       // Gerar token
//       const token = generateToken();
//
//       return mockAsync<RegisterResponse>({
//         user: newProvider,
//         token
//       });
//     },
//
//       whoami: async (token: string): Promise<User | null> => {
//         // Em uma aplicação real, o token seria validado no servidor
//         // Aqui simulamos que o token é válido se existir
//         if (!token) {
//           return mockAsync(null);
//         }
//
//         // Para simulação, retornamos um usuário aleatório
//         // Em uma aplicação real, o usuário seria obtido com base no token
//         const userCategories = ['clientes', 'prestadores', 'admins'] as const;
//         const randomCategory = userCategories[Math.floor(Math.random() % userCategories.length)];
//         const randomUser = mockUsers[randomCategory][0];
//
//         // Clone do usuário para remover a senha
//         const { password: _, ...userWithoutPassword } = randomUser as any;
//
//         return mockAsync<User>(userWithoutPassword as User);
//       }
//