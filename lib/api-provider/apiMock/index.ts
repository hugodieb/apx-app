import { mockUsers } from '@/lib/mock-data';
import { LoginParams, RegisterParams } from '@/types/auth';
import { ClienteUser, PrestadorUser, AdminUser, User, UserType } from '@/types/user';
import { mockasync } from '@/lib/utils/mockasync';
import { useAuthStore } from '@/store/auth';

type whoAMIresponse =
  | { success: true; user: ClienteUser; userType: "cliente" }
  | { success: true; user: PrestadorUser; userType: "prestador" }
  | { success: true; user: AdminUser; userType: "admin" }
  | { success: false; error: string };

export const login = async (params: LoginParams): Promise<User> => {
  const { email, password } = params;

  const userCategories = ['clientes', 'prestadores', 'admins'] as const;
  let foundUser: User | undefined;

  for (const category of userCategories) {
    const user = mockUsers[category].find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      foundUser = user as User;
      break;
    }
  }

  if (!foundUser) {
    return mockasync<User>(null as unknown as User) as Promise<User>;
  }

  const { password: _, ...userWithoutPassword } = foundUser as any;

  return mockasync<User>(userWithoutPassword as User);
}

export const logout = async (): Promise<void> => {
  return mockasync<void>(undefined)
}

export const register = async (params: RegisterParams): Promise<User> => {

  const emailExists = Object.values(mockUsers).some(
    (userCategory) => userCategory.some((user) => user.email === params.email)
  );

  if (emailExists) {
    return mockasync<User>(null as unknown as User) as Promise<User>;
  }

  switch (params.type) {
    case 'cliente':

      const clienteUser: User = { email: params.email, type: 'cliente' } as User;
      return mockasync<User>(clienteUser);

    case 'prestador':

      const prestadorUser: User = { email: params.email, type: 'prestador' } as User;
      return mockasync<User>(prestadorUser);

    case 'admin':
      const adminUser: User = { email: params.email, type: 'admin' } as User;
      return mockasync<User>(adminUser);
  }
}

export const whoami = async (): Promise<whoAMIresponse> => {
  const { userType, user } = useAuthStore.getState()

  if (!userType || !user) {
    return { success: false, error: "Nenhum usuário autenticado" };
  }
  switch (userType) {
    case "cliente":
      return { success: true, user: user as ClienteUser, userType: "cliente" };
    case "prestador":
      return { success: true, user: user as PrestadorUser, userType: "prestador" };
    case "admin":
      return { success: true, user: user as AdminUser, userType: "admin" };
    default:
      return { success: false, error: "Tipo de usuário inválido" };
  }
}
