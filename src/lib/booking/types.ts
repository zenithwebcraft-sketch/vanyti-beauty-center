// ========== BOOKING TYPES ==========

export interface BookingSlot {
  dateTime: string; // ISO 8601 format
  available: boolean;
  price?: number;
}

export interface SelectedService {
  id: string;
  title: string;
  durationMin: number;
  priceEUR: number;
}

export interface BookingFormData {
  // Step 1: Service selection
  serviceId: string;

  // Step 2: Date/Time selection
  date: string; // YYYY-MM-DD
  time: string; // HH:MM

  // Step 3A: Email
  email: string;

  // Step 3B: Personal info
  phone: string;
  firstName: string;
  lastName: string;
}

export interface BookingConfirmation {
  bookingId: string;
  service: SelectedService;
  dateTime: string;
  location: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  totalPrice: number;
  currency: string;
  eventId?: string; // Google Calendar Event ID
}

export interface BusyTimeSlot {
  start: string; // ISO 8601
  end: string; // ISO 8601
}

export interface AvailabilityResponse {
  date: string;
  slots: BookingSlot[];
  busyTimes: BusyTimeSlot[];
}

export interface BookingApiRequest {
  serviceId: string;
  serviceTitle: string;  // 🆕 AGREGAR ESTA LÍNEA
  dateTime: string; // ISO 8601
  duration: number;  // 🆕 AGREGAR ESTA LÍNEA
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  locationId?: string;
}


export interface BookingApiResponse {
  success: boolean;
  data?: BookingConfirmation;
  error?: {
    code: string;
    message: string;
  };
}
