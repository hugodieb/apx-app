import { AppointmentWithClient } from '@/types/appointment';
import { create } from 'zustand';

interface AppointmentStore {
  appointments: AppointmentWithClient[];

  setAppointments: (data: AppointmentWithClient[]) => void;
  getAppointments: () => AppointmentWithClient[];
  updateAppointment: (appointment: AppointmentWithClient) => void;
}

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
  appointments: [],

  setAppointments: (data) => {
    set({ appointments: data });
  },

  getAppointments: () => get().appointments,

  updateAppointment: (updated) => {
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === updated.id ? { ...a, ...updated } : a
      ),
    }));
  },
}));
