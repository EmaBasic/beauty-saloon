export interface Service {
  id: number;
  category: string;
  name: string;
  durationMin: number;
  price: number;
}

export interface Worker {
  id: number;
  displayName: string;
}

export interface Booking {
  id: number;
  serviceId: number;
  workerId: number;
  startTime: string; // ISO string
  customer: {
    fullName: string;
    phone: string;
    email: string;
  };
  notes: string;
  status: "CONFIRMED" | "CANCELLED" | "PENDING";
}

// Mock data
export const services: Service[] = [
  {
    id: 1,
    category: "Nails",
    name: "Gel manicure",
    durationMin: 60,
    price: 35,
  },
  {
    id: 2,
    category: "Eyebrows",
    name: "Brow shaping",
    durationMin: 30,
    price: 15,
  },
  {
    id: 3,
    category: "Eyelashes",
    name: "Lash lift",
    durationMin: 45,
    price: 25,
  },
];

export const workers: Worker[] = [
  { id: 1, displayName: "Amina" },
  { id: 2, displayName: "Lejla" },
  { id: 3, displayName: "Sara" },
];

export const bookings: Booking[] = [
  {
    id: 101,
    serviceId: 1,
    workerId: 2,
    startTime: "2025-12-20T10:00:00+01:00",
    customer: {
      fullName: "Ana Markovic",
      phone: "+38761123456",
      email: "ana@example.com",
    },
    notes: "First time visit",
    status: "CONFIRMED",
  },
];
