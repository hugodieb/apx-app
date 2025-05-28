import { BaseUser } from '@/types/user';
import { useMutation } from '@tanstack/react-query';
import { authApi as api } from '@/lib/api-provider';
import { useAppointmentStore } from '@/store/appointmentStore';
import { Appointment, AppointmentWithClient } from '@/types/appointment';
import { toast } from 'sonner';
import { error } from 'console';

interface UpdateAppointmentParams {
  appointmentId: string;
  status: Appointment['status'];
  reason?: string;
}

export function useProviderAppointments() {
  const setAppointments = useAppointmentStore.getState().setAppointments;
  const updateAppointment = useAppointmentStore.getState().updateAppointment;

  const providerAppointmentsMutation = useMutation({
    mutationFn: async (params: BaseUser): Promise<AppointmentWithClient[]> => {
      return api.appointments(params);
    },
    onSuccess: (appointments) => {
      setAppointments(appointments);
    },
  });

  const updateProviderAppointmentStatusMutation = useMutation({
    mutationFn: async ({ appointmentId, status, reason }: UpdateAppointmentParams): Promise<AppointmentWithClient> => {
      return api.updateAppointmentStatus(appointmentId, status, reason);
    },
    onSuccess: (appointment) => {
      updateAppointment(appointment);
      toast.success("Atualizado com sucesso!")
    },
    onError: (error) => {
      toast.error("Algo deu errado!, contate o administrador.")
    }
  });

  const updateStatus = (appointmentId: string, status: Appointment['status'], reason?: string) => {
    updateProviderAppointmentStatusMutation.mutate({ appointmentId, status, reason });
  };

  const acceptProviderAppointment = (appointmentId: string, reason?: string) => updateStatus(appointmentId, 'confirmed');
  const rejectProviderAppointment = (appointmentId: string, reason?: string) => updateStatus(appointmentId, 'cancelled', 'Rejected by provider');

  return {
    appointmentsProvider: providerAppointmentsMutation.mutate,
    acceptProviderAppointment,
    rejectProviderAppointment,
    isLoadingAppointments: providerAppointmentsMutation.isPending,
    isUpdatingStatus: updateProviderAppointmentStatusMutation.isPending,
    appointmentsError: providerAppointmentsMutation.error,
    updateError: updateProviderAppointmentStatusMutation.error,
  };
}
