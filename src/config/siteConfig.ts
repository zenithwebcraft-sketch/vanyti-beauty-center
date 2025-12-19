// ========== IMPORTS ==========
import businessData from './business.json';
import servicesData from './services.json';
import staffData from './staff.json';
import bookingData from './booking.json';

// ========== TYPES ==========
export interface Service {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  benefits: string[];
  icon: string;
  durationMin: number;
  priceEUR: number;
  image?: string;
  imageAlt?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  active: boolean;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  mapUrl: string;
}

export interface BookingConfig {
  timezone: string;
  slotIntervalMin: number;
  currency: string;
  defaultLocationId: string;
  openDays: string[];
  openHours: {
    start: string;
    end: string;
  };
  policies: {
    paymentMethod: string;
    cancellationWindow: string;
    depositRequired: boolean;
  };
  emailConfig: {
    fromAddress: string;
    fromName: string;
    replyTo: string;
  };
}

// ========== EXPORTS ==========
export const siteConfig = businessData.business;
export const services: Service[] = servicesData.services;
export const staff: StaffMember[] = staffData.staff;
export const bookingConfig: BookingConfig = bookingData.bookingConfig;

// ========== HELPER FUNCTIONS ==========
export const getServiceById = (id: string): Service | undefined => {
  return services.find((s) => s.id === id);
};

export const getLocationById = (id: string): Location | undefined => {
  return siteConfig.locations.find((l) => l.id === id);
};

export const getActiveStaff = (): StaffMember[] => {
  return staff.filter((s) => s.active);
};

// ========== LEGACY EXPORTS (para compatibilidad) ==========
export const pricingPlans = [
  {
    name: "Básico",
    description: "Ideal para mantenimiento mensual",
    price: "49€",
    period: "/mes",
    features: [
      "1 Depilación de cejas",
      "1 Manicura básica",
      "Descuento 10% en servicios",
      "Acceso a ofertas exclusivas",
    ],
    highlighted: false,
  },
  {
    name: "Premium",
    description: "Nuestro plan más popular",
    price: "89€",
    period: "/mes",
    features: [
      "2 Tratamientos de cejas o pestañas",
      "2 Manicuras o pedicuras",
      "1 Tratamiento facial básico",
      "Descuento 20% en servicios",
      "Reserva prioritaria",
    ],
    highlighted: true,
  },
  {
    name: "VIP",
    description: "Experiencia completa de belleza",
    price: "149€",
    period: "/mes",
    features: [
      "Tratamientos ilimitados de cejas",
      "4 Manicuras o pedicuras",
      "2 Tratamientos faciales premium",
      "Descuento 30% en todos los servicios",
      "Acceso VIP sin esperas",
      "Productos de regalo mensuales",
    ],
    highlighted: false,
  },
];

export const team = staff; // Alias para compatibilidad

export const testimonials = [
  {
    name: "María García",
    rating: 5,
    text: "¡Increíble experiencia! Dayana es una artista con las cejas. Nunca había quedado tan satisfecha con el resultado.",
    service: "Depilación con hilo",
  },
  {
    name: "Carmen López",
    rating: 5,
    text: "Las extensiones de pestañas de Isis son perfectas. Se ven súper naturales y duran muchísimo.",
    service: "Extensiones de pestañas",
  },
  {
    name: "Laura Martínez",
    rating: 5,
    text: "El mejor centro de estética de Murcia. El equipo es muy profesional y el ambiente es súper acogedor.",
    service: "Tratamiento facial",
  },
  {
    name: "Ana Sánchez",
    rating: 5,
    text: "Leumin hace magia con las uñas. Siempre salgo con diseños únicos que me encantan.",
    service: "Nail art",
  },
  {
    name: "Patricia Ruiz",
    rating: 5,
    text: "Llevo años viniendo y nunca me han decepcionado. Calidad y trato excepcional.",
    service: "Cliente habitual",
  },
];
