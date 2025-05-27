import { ClienteUser } from '@/types/user'
import { create } from 'zustand'

type Appointment = {
  id: string,
  clientId: string,
  client: ClienteUser,
  providerId: string,
  establishmentId: string,
  serviceId: string,
  date: string,
  endDate?: string,
  status?: 'pending' | 'confirmed' | 'cancelled',
  price: number,
}

interface AppointmentStore {
  appointments: Appointment[]
  setAppointments: (data: Appointment[]) => void
  getAppointments: () => Appointment[]
  updateAppointment: (appointment: Appointment) => void
}

export const useAppointmentStore = create<AppointmentStore>()((set, get) => ({
  appointments: [],

  setAppointments: (data) => set({ appointments: data }),

  getAppointments: () => {
    return get().appointments
  },
  updateAppointment: (appointment) => {
    const appointments = get().appointments.map((a) =>
      a.id === appointment.id ? { ...a, ...appointment } : a
    )
    set({ appointments })
  },
}))