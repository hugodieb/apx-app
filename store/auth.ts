import { create } from 'zustand'
import type { User } from '@/types/user'

type Address = {
  street: string
  city: string
  state: string
  zipCode: string
}

type AuthStore = {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}))
