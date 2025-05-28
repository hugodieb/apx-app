import { ClienteUser } from "./user";

export interface Appointment {
  id: string,
  clientId: string,
  providerId: string,
  establishmentId: string,
  serviceId: string,
  date: string,
  endDate?: string,
  status?: 'pending' | 'confirmed' | 'cancelled',
  reason?: string,
  price: number,
}

export interface AppointmentWithClient extends Appointment {
  client: ClienteUser;
}

