export interface ServiceItem {
  id: string;
  name: string;
  price: string;
  priceValue?: number;
  durationMinutes: number;
  description?: string;
  category: 'men' | 'women' | 'kids';
}

export interface ServiceCategory {
  id: 'men' | 'women' | 'kids';
  title: string;
  description: string;
  items: ServiceItem[];
}

export interface AvailableSlotsResponse {
  date: string;
  availableSlots: string[];
  bookedSlots: string[];
}

export interface CreateBookingPayload {
  clientName: string;
  clientPhone: string;
  serviceId: string;
  date: string;
  timeSlot: string;
  masterId?: string;
  notes?: string;
}

export interface BookingConfirmation {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  servicePrice?: string;
  masterName?: string;
  date: string;
  timeSlot: string;
  notes?: string;
  createdAt: string;
  status: string;
  booking?: {
    id: string;
    clientName: string;
    clientPhone: string;
    serviceName: string;
    price: string;
    date: string;
    timeSlot: string;
    masterName?: string;
    status: string;
    createdAt: string;
  };
}

export interface ReviewItem {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
  serviceUsed: string;
  avatarUrl?: string;
}
