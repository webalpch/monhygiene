import { Service } from './reservation';

export interface CartItem {
  id: string;
  service: Service;
  formData?: Record<string, any>;
  estimatedPrice: number;
  timestamp: number;
}

export interface Cart {
  id: string;
  sessionId: string;
  items: CartItem[];
  totalPrice: number;
  address?: any;
  contactInfo?: {
    name: string;
    email: string;
    phone: string;
  };
}

export type CartStep = 'services' | 'address' | 'schedule' | 'contact';