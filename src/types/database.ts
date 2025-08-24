export interface Reservation {
  id: string;
  created_at: string;
  updated_at: string;
  
  // Informations client
  client_name: string;
  client_email: string;
  client_phone: string;
  
  // Adresse
  address: string;
  city: string;
  postcode: string;
  coordinates: [number, number];
  
  // Service
  service_type: string;
  service_details: Record<string, any>;
  
  // Planification
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  
  // Statut
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  
  // Financier
  estimated_price: number;
  final_price?: number;
  price?: number;
  payment_status: 'pending' | 'paid' | 'refunded';
  
  // Notes
  notes?: string;
  internal_notes?: string;
}

export interface DashboardStats {
  total_reservations: number;
  total_revenue: number;
  monthly_revenue: number;
  pending_reservations: number;
  completed_reservations: number;
  cancellation_rate: number;
}

export interface CalendarEvent {
  id: string;
  date: string;
  time: string;
  client_name: string;
  service_type: string;
  duration_minutes: number;
  status: string;
  estimated_price: number;
}