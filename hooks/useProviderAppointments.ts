import { BaseUser, User } from '@/types/user';
import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi as api } from '@/lib/api-provider';
import { useAppointmentStore } from '@/store/appointmentStore';
import { appointmentTypes } from '@/types/appointment';

interface UpdateAppointmentParams {
  appointmentId: string;
  status: appointmentTypes['status'];
}

export function useProviderAppointments() {

  const providerAppointmentsMutation = useMutation({
    mutationFn: async (params: BaseUser): Promise<appointmentTypes[]> => {
      const response = await api.appointments(params)
      return response
    },
    onSuccess: async (appointments) => {
      useAppointmentStore.getState().setAppointments(appointments)
    }
  })

  const updateProviderAppointmentStatusMutation = useMutation({
    mutationFn: async (params: UpdateAppointmentParams): Promise<appointmentTypes> => {
      const response = await api.updateAppointmentStatus(params.appointmentId, params.status);
      return response;
    },
    onSuccess: async (appointment) => {
      useAppointmentStore.getState().updateAppointment(appointment);
    },
  })

  const acceptProviderAppointment = (appointmentId: string) => {
    updateProviderAppointmentStatusMutation.mutate({
      appointmentId,
      status: 'confirmed'
    });
  }

  const rejecProvidertAppointment = (appointmentId: string) => {
    updateProviderAppointmentStatusMutation.mutate({
      appointmentId,
      status: 'cancelled'
    })
  }

  const clientAppointmentsMutation = useMutation({
    mutationFn: async (clientId: string): Promise<appointmentTypes[]> => {
      const response = await api.getClientAppointments(clientId);
      return response;
    },
    onSuccess: async (appointments) => {
      //useAppointmentStore.getState().setAppointments(appointments);
    }
  })

  return {
    appointmentsProvider: providerAppointmentsMutation.mutate,
    clientAppointments: clientAppointmentsMutation.mutate,
    acceptProviderAppointment,
    rejecProvidertAppointment,
    isLoadingAppointments: providerAppointmentsMutation.isPending,
    isUpdatingStatus: updateProviderAppointmentStatusMutation.isPending,
    appointmentsError: providerAppointmentsMutation.error,
    updateError: updateProviderAppointmentStatusMutation.error,
  }
}