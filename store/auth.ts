import { create } from 'zustand';
import { ClienteUser, PrestadorUser, AdminUser } from '@/types/user'

interface BaseAuthState {
  isAuthenticated: boolean;
  logout: () => void;
}

interface ClienteAuthState extends BaseAuthState {
  userType: 'cliente';
  user: ClienteUser;
}

interface PrestadorAuthState extends BaseAuthState {
  userType: 'prestador';
  user: PrestadorUser;
}

interface AdminAuthState extends BaseAuthState {
  userType: 'admin';
  user: AdminUser;
}

interface UnauthenticatedState extends BaseAuthState {
  userType: null;
  user: null;
}

type AuthState =
  | ClienteAuthState
  | PrestadorAuthState
  | AdminAuthState
  | UnauthenticatedState;

interface AuthActions {
  setClienteUser: (user: ClienteUser) => void;
  setPrestadorUser: (user: PrestadorUser) => void;
  setAdminUser: (user: AdminUser) => void;
  updateProfile: <T extends ClienteUser | PrestadorUser | AdminUser>(userData: Partial<T>) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  (set) => ({
    isAuthenticated: false,
    userType: null,
    user: null,

    setClienteUser: (user: ClienteUser) =>
      set({ isAuthenticated: true, userType: 'cliente', user }),

    setPrestadorUser: (user: PrestadorUser) =>
      set({ isAuthenticated: true, userType: 'prestador', user }),

    setAdminUser: (user: AdminUser) =>
      set({ isAuthenticated: true, userType: 'admin', user }),

    updateProfile: (userData) =>
      set((state) => {
        if (!state.isAuthenticated || !state.user) return state;

        if (state.userType === 'cliente' && state.user.type === 'cliente') {
          return {
            ...state,
            user: { ...state.user, ...userData } as ClienteUser,
          };
        } else if (state.userType === 'prestador' && state.user.type === 'prestador') {
          return {
            ...state,
            user: { ...state.user, ...userData } as PrestadorUser,
          };
        } else if (state.userType === 'admin' && state.user.type === 'admin') {
          return {
            ...state,
            user: { ...state.user, ...userData } as AdminUser,
          };
        }

        return state;
      }),

    logout: () =>
      set({ isAuthenticated: false, userType: null, user: null }),
  })
);


export const useClienteAuth = () => {
  const state = useAuthStore();
  return {
    isAuthenticated: state.isAuthenticated && state.userType === 'cliente',
    user: state.userType === 'cliente' ? state.user : null,
    updateProfile: state.updateProfile,
    logout: state.logout
  };
};

export const usePrestadorAuth = () => {
  const state = useAuthStore();
  return {
    isAuthenticated: state.isAuthenticated && state.userType === 'prestador',
    user: state.userType === 'prestador' ? state.user : null,
    updateProfile: state.updateProfile,
    logout: state.logout
  };
};

export const useAdminAuth = () => {
  const state = useAuthStore();
  return {
    isAuthenticated: state.isAuthenticated && state.userType === 'admin',
    user: state.userType === 'admin' ? state.user : null,
    updateProfile: state.updateProfile,
    logout: state.logout
  };
};