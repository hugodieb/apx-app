import { ClienteUser } from "./user";

export interface appointmentTypes {
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