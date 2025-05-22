import { mockUsers } from '@/lib/mock-data';
import { LoginParams, RegisterParams } from '@/types/auth';
import { User } from '@/types/user';
import { mockasync } from '@/lib/utils/mockasync';
import Cookies from 'js-cookie'

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
  const role = Cookies.get('x-user-role') || '';

  if (role) {
    Cookies.remove('x-user-role');
  }
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

export const whoami = async () => {
  const role = Cookies.get('x-user-role') || '';
  let user;

  switch (role) {
    case 'cliente':
      user = mockUsers.clientes[0];
      break;
    case 'prestador':
      user = mockUsers.prestadores[0];
      break;
    case 'admin':
      user = mockUsers.admins[0];
      break;
    default:
      user = { id: 0, name: 'Sem Nome', email: 'semnome@email.com', type: 'cliente' };
  }

  return mockasync<User>(user as User)
}
