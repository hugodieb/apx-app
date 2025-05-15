import { useMutation } from '@tanstack/react-query';
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { User, ROUTE_DASHBOARD, ClienteUser, PrestadorUser, AdminUser } from '@/types/user';
import { authApi as api } from '@/lib/api-provider';
import { LoginParams } from '@/types/auth';
import { useAuthStore } from '@/store/auth';

export function useAuth() {
  const router = useRouter();
  const authStore = useAuthStore.getState();

  const loginMutation = useMutation({
    mutationFn: async (params: LoginParams) => {
      const response = await api.login(params);
      return response;
    },
    onSuccess: (user: User) => {
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
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await api.logout();
      return response
    },
    onSuccess: () => {
      authStore.logout();
      toast.success('Até breve...');
    },
    onError: (error) => {
      toast.error("Algo deu errado, se possível contate o administrador.");
    }
  })

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate
  }
};

