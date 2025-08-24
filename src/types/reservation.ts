
export type MapboxAddress = {
  id: string;
  place_name: string;
  center: [number, number];
  address: string;
  city: string;
  postcode: string;
};

export type Service = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

export type TimeSlot = {
  date: Date;
  period: 'morning' | 'afternoon';
  label: string;
};

export type Contact = {
  name: string;
  email: string;
  phone: string;
};

export type ReservationDraft = {
  address: MapboxAddress | null;
  serviceId: string;
  subThemes: Record<string, string>;
  slot: TimeSlot | null;
  contact: Contact;
};

export type WizardStep = 'address' | 'service' | 'subthemes' | 'schedule' | 'contact';
