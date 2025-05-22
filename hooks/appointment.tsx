import { BaseUser, User } from '@/types/user';
import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi as api } from '@/lib/api-provider';
import { useAppointmentStore } from '@/store/appointmentStore';
import { appointment } from '@/types/appointment';

export function Appointments() {

  const appointment = useMutation({
    mutationFn: async (params: BaseUser): Promise<appointment[]> => {
      debugger
      const response = await api.appointments(params)
      return response
    },
    onSuccess: async (appointments) => {
      useAppointmentStore.getState().setAppointments(appointments)
    }
  })

  return {
    appointments: appointment.mutate,
  }
}