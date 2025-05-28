import { mockAppointments, mockUsers } from '@/lib/mock-data';
import { mockasync } from '@/lib/utils/mockasync';
import { Appointment, AppointmentWithClient } from '@/types/appointment';
import { BaseUser, ClienteUser } from '@/types/user';

export const appointments = async (params: BaseUser) => {
  const { id } = params;

  const userAppointments: AppointmentWithClient[] = mockAppointments
    .filter((u) => u.clientId === id || u.providerId === id)
    .map((u) => {
      return {
        ...u,
        client: mockUsers.clientes.find(c => c.id === u.clientId) as unknown as ClienteUser,
        status: u.status as "pending" | "confirmed" | "cancelled"
      };
    });

  if (userAppointments.length > 0) {
    return mockasync<AppointmentWithClient[]>(userAppointments);
  }
  return mockasync<AppointmentWithClient[]>([]);
}


export const updateAppointmentStatus = async (
  appointmentId: string,
  status: AppointmentWithClient['status'],
  reason?: string
) => {
  if (!appointmentId) {
    throw new Error("ID do agendamento não fornecido");
  }

  const appointment = mockAppointments.find(
    (a) => a.id === appointmentId
  );

  if (!appointment) {
    throw new Error(`Agendamento com ID ${appointmentId} não encontrado`);
  }

  // Atualiza o status
  appointment.status = (status || 'pending')

  appointment.reason = (reason || '')

  // Busca os dados do cliente para preencher o campo 'client'
  const clientData = mockUsers.clientes.find(c => c.id === appointment.clientId) as unknown as ClienteUser;

  if (!clientData) {
    throw new Error(`Cliente com ID ${appointment.clientId} não encontrado`);
  }

  // Monta o objeto completo conforme o tipo esperado
  const updatedWithClient: AppointmentWithClient = {
    ...appointment,
    status: appointment.status as "pending" | "confirmed" | "cancelled",
    client: clientData
  };

  return mockasync<AppointmentWithClient>(updatedWithClient);
};