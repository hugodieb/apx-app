export interface appointment {
  id: string,
  clientId: string,
  providerId: string,
  establishmentId: string,
  serviceId: string,
  date: string,
  status: 'pending' | 'confirmed' | 'cancelled',
  price: number,
}