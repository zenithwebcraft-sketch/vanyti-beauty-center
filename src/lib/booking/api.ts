import { BookingApiRequest, BookingApiResponse, AvailabilityResponse } from './types';

const API_BASE = import.meta.env.VITE_APP_URL || '';

/**
 * Obtener slots disponibles para una fecha específica
 */
export const fetchAvailability = async (date: string, serviceId: string): Promise<AvailabilityResponse> => {
  const response = await fetch(`${API_BASE}/api/booking/availability?date=${date}&serviceId=${serviceId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch availability');
  }
  
  const result = await response.json();
  return result.data;
};

/**
 * Crear una nueva reserva
 */
export const createBooking = async (bookingData: BookingApiRequest): Promise<BookingApiResponse> => {
  const response = await fetch(`${API_BASE}/api/booking/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData),
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error?.message || 'Failed to create booking');
  }
  
  return result;
};
