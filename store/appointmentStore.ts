import { AppointmentWithClient } from '@/types/appointment';
import { create } from 'zustand';

interface AppointmentStore {
  appointments: AppointmentWithClient[];
  isLoadingAppointments: boolean;

  setAppointments: (data: AppointmentWithClient[]) => void;
  getAppointments: () => AppointmentWithClient[];
  updateAppointment: (appointment: AppointmentWithClient) => void;
  setIsLoadingAppointments: (value: boolean) => void;
}

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
  appointments: [],
  isLoadingAppointments: false,

  setAppointments: (data) => {
    set({ appointments: data });
  },

  getAppointments: () => get().appointments,

  setIsLoadingAppointments: (value: boolean) => set({ isLoadingAppointments: value }),

  updateAppointment: (updated) => {
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === updated.id ? { ...a, ...updated } : a
      ),
    }));
  },
}));
