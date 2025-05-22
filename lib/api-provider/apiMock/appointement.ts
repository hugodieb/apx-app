import { mockAppointments } from '@/lib/mock-data';
import { mockasync } from '@/lib/utils/mockasync';
import { appointment } from '@/types/appointment';
import { BaseUser } from '@/types/user';

export const appointments = async (params: BaseUser) => {
  const { id } = params;

  const userAppointments = mockAppointments
    .filter((u) => u.clientId === id || u.providerId === id)
    .map((u) => ({
      ...u,
      status: u.status as "confirmed" | "pending" | "cancelled",
    }));

  if (userAppointments.length > 0) {
    return mockasync<appointment[]>(userAppointments);
  }

  // Se não encontrar nenhum, retorna array vazio
  return mockasync<appointment[]>([]);
}

