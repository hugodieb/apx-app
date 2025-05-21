import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { User, ROUTE_DASHBOARD, ClienteUser, PrestadorUser, AdminUser } from '@/types/user';
import { authApi as api } from '@/lib/api-provider';
import { LoginParams, RegisterParams } from '@/types/auth';
import { useAuthStore } from '@/store/auth';

export function useAuth() {
  const router = useRouter();
  const authStore = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (params: LoginParams) => {
      const response = await api.login(params);
      return response as User;
    },
    onSuccess: async (user: User) => {
      switch (user.type) {
        case 'cliente':
          authStore.setClienteUser(user as ClienteUser);
          break;
        case 'prestador':
          authStore.setPrestadorUser(user as PrestadorUser);
          break;
        case 'admin':
          authStore.setAdminUser(user as AdminUser);
          break;
      }

      toast.success('Login realizado com sucesso');
      const redirectRoute = ROUTE_DASHBOARD[user.type];
      router.push(redirectRoute);
    },
    onError: (error: any) => {
      toast.error('Usuário e/ou senha incorretos.');
      return error;
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await api.logout();
      return response;
    },
    onSuccess: () => {
      authStore.logout();
    },
    onError: (error: any) => {
      toast.error("Algo deu errado, se possível contate o administrador.");
      return error
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (params: RegisterParams): Promise<User> => {
      const response = await api.register(params);
      return response as User;
    },
    onSuccess: (user: User) => {
      toast.success('Cadastro realizado com sucesso');
      const redirectRoute = ROUTE_DASHBOARD[user.type];
      router.push(redirectRoute);
    },
  });

  const checkWhoami = async () => {
    try {
      debugger
      const user = await api.whoami()
      switch (user.type) {
        case 'cliente':
          authStore.setClienteUser(user as ClienteUser);
          break;
        case 'prestador':
          authStore.setPrestadorUser(user as PrestadorUser);
          break;
        case 'admin':
          authStore.setAdminUser(user as AdminUser);
          break;
      }

      return user;

    } catch (error) {
      await api.logout()

      return null
    }
  }

  const { data: user, isLoading, isFetching, isError } = useQuery({
    queryKey: ['auth'],
    queryFn: checkWhoami,
    retry: false
  })

  return {
    user,
    isLoading,
    isFetching,
    isError,
    isLoginPending: loginMutation.isPending,
    isLoginSucess: loginMutation.isSuccess,
    isLoginError: loginMutation.isError,
    isRegisterPending: registerMutation.isPending,
    isRegisterSucess: registerMutation.isSuccess,
    isRegisterError: registerMutation.isError,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    register: registerMutation.mutate,
  };
}
