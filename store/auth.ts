import { create } from 'zustand'
import type { User } from '@/types/user'

type AuthStore = {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User) => void
  logout: () => void
}

type SettingsStore = {
  changePassword: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }
  preferences: {
    notifications: boolean
    emailMarketing: boolean
    darkMode: boolean
  }
  services: {
    serviceType: 'hora' | 'dia' | 'servico' | 'projeto'
    autoAcceptBookings: boolean
    advanceBookingDays: string
    cancellationPolicy: 'flexivel' | 'moderada' | 'rigorosa'
  }
  setChangePassword: (data: Partial<SettingsStore['changePassword']>) => void
  setPreferences: (data: Partial<SettingsStore['preferences']>) => void
  setServices: (data: Partial<SettingsStore['services']>) => void
}

type ServicesStore = {
  services: {
    id: string
    name: string
    price: number
    duration: number
  }[]
  setServices: (data: ServicesStore['services']) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}))

export const useSettingsStore = create<SettingsStore>((set) => ({
  changePassword: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  },
  preferences: {
    notifications: true,
    emailMarketing: false,
    darkMode: false,
  },
  services: {
    serviceType: 'hora',
    autoAcceptBookings: false,
    advanceBookingDays: '0',
    cancellationPolicy: 'flexivel',
  },
  setChangePassword: (data) =>
    set((state) => ({
      changePassword: { ...state.changePassword, ...data },
    })),
  setPreferences: (data) =>
    set((state) => ({
      preferences: { ...state.preferences, ...data },
    })),
  setServices: (data) =>
    set((state) => ({
      services: { ...state.services, ...data },
    })),
}))

export const useServicesStore = create<ServicesStore>((set) => ({
  services: [],
  setServices: (data) => set({ services: data }),
}))