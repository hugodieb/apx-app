import { mockAppointments, mockUsers } from '@/lib/mock-data';
import { mockasync } from '@/lib/utils/mockasync';
import { appointment } from '@/types/appointment';
import { BaseUser } from '@/types/user';

export const appointments = async (params: BaseUser) => {
  const { id } = params;

  const userAppointments = mockAppointments
    .filter((u) => u.clientId === id || u.providerId === id)
    .map((u) => {

      const clientData = mockUsers.clientes.find(client => client.id === u.clientId);

      return {
        ...u,
        status: u.status as "confirmed" | "pending" | "cancelled",
        client: clientData,
      };
    });

  if (userAppointments.length > 0) {
    return mockasync<appointment[]>(userAppointments);
  }
  return mockasync<appointment[]>([]);
}

export const getClientAppointments = async (clientId: string) => {
  if (!clientId) {
    throw new Error("ID do cliente não fornecido");
  }
  const clientAppointments = mockAppointments.filter(
    (appointment) => appointment.clientId === clientId
  );

  if (clientAppointments.length === 0) {
    throw new Error(`Nenhum agendamento encontrado para o cliente com ID ${clientId}`);
  }

  return mockasync<appointment[]>(
    clientAppointments.map((appointment) => ({
      ...appointment,
      status: appointment.status as "confirmed" | "pending" | "cancelled",
    }))
  );

}


export const updateAppointmentStatus = async (
  appointmentId: appointment['id'], status: appointment['status']
) => {
  if (!appointmentId) {
    throw new Error("ID do agendamento não fornecido");
  }

  const appointmentIndex = mockAppointments.findIndex(
    (appointment) => appointment.id === appointmentId
  );

  if (appointmentIndex === -1) {
    throw new Error(`Agendamento com ID ${appointmentId} não encontrado`);
  }

  mockAppointments[appointmentIndex].status = status || "pending";

  const updatedAppointment = {
    ...mockAppointments[appointmentIndex],
    status: mockAppointments[appointmentIndex].status as "confirmed" | "pending" | "cancelled",
  };

  return mockasync<appointment>(updatedAppointment);
}

