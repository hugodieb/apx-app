export type UserType = 'cliente' | 'prestador' | 'admin';

// Interface comum para todos os usuários
export interface BaseUser {
  id: string;
  email: string;
  name: string;
  type: UserType;
}

// Interface para endereço
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

// Interface para serviço
export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

// Interface para preferências do usuário
export interface UserPreferences {
  notifications: boolean;
  emailMarketing: boolean;
  darkMode: boolean;
  language: string;
}

// Interface para configurações do prestador
export interface ProviderSettings {
  serviceType: string;
  autoAcceptBookings: boolean;
  advanceBookingDays: boolean;
  cancellationPolicy: string;
}

// Interface para mídia social
export interface SocialMedia {
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
}

// Interface para cliente
export interface ClienteUser extends BaseUser {
  type: 'cliente';
  phone: string;
  avatar: string;
  bio: string;
  cpf: string;
  birthDate: string;
  gender: 'masculino' | 'feminino' | 'outro' | 'prefiro_nao_informar';
  address: Address;
}

// Interface para prestador
export interface PrestadorUser extends BaseUser {
  type: 'prestador';
  phone: string;
  avatar: string;
  bio: string;
  birthDate: string;
  cpf: string;
  gender: 'masculino' | 'feminino' | 'outro' | 'prefiro_nao_informar';
  profession: string;
  address: Address;
  establishmentId: string;
  serviceType: string;
  services: Service[];
  preferences: UserPreferences;
  settings: ProviderSettings;
  rating: number;
  socialMedia: SocialMedia;
}

// Interface para admin
export interface AdminUser extends BaseUser {
  type: 'admin';
  role: string;
}

export type User = ClienteUser | PrestadorUser | AdminUser;


export const ROUTE_DASHBOARD: Record<User["type"], string> = {
  cliente: "/cliente/dashboard",
  prestador: "/prestador/dashboard",
  admin: "/admin/dashboard",
};

