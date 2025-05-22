import { create } from 'zustand'

type Appointment = {
  id: string
  clientId: string
  providerId: string
  establishmentId: string
  serviceId: string
  date: string
  endDate?: string
  status?: 'pending' | 'confirmed' | 'cancelled'
  price: number
}

interface AppointmentStore {
  appointments: Appointment[]
  setAppointments: (data: Appointment[]) => void
  getAppointments: () => Appointment[]
}

export const useAppointmentStore = create<AppointmentStore>()((set, get) => ({
  appointments: [],

  setAppointments: (data) => set({ appointments: data }),

  getAppointments: () => {
    return get().appointments
  },
}))