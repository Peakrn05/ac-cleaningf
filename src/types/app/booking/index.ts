export type ServiceId =
  | "split-1" | "split-multi" | "cassette"
  | "central" | "deep-clean" | "chemical-wash";

export type BookingStatus =
  | "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";

export interface Service {
  id: ServiceId;
  name: string;
  icon: string;
  price: number;
  priceUnit: string;
  duration: string;
  desc: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  service: ServiceId;
  units: number;
  btu: number;
  date: string;
  timeSlot: string;
  address: string;
  notes: string;
  status: BookingStatus;
  total: number;
  createdAt: string;
}

export function getBtuMultiplier(btu: number) {
  if (btu < 5000) return 1;
  if (btu <= 12000) return 1.15;
  if (btu <= 24000) return 1.3;
  return 1.5;
}

export function calculateBookingTotal(price: number, units: number, btu: number) {
  return Number((price * units * getBtuMultiplier(btu)).toFixed(2));
}

export const SERVICES: Service[] = [
  { id: "split-1",       name: "Split AC - 1 Unit",     icon: "fan",    price: 35,  priceUnit: "/unit",  duration: "1-2 hrs", desc: "Standard cleaning for a single wall-mount split AC." },
  { id: "split-multi",   name: "Split AC - Multi Unit", icon: "wind",   price: 30,  priceUnit: "/unit",  duration: "2-4 hrs", desc: "Discounted per-unit rate for 2 or more split units." },
  { id: "cassette",      name: "Cassette AC",           icon: "panel",  price: 55,  priceUnit: "/unit",  duration: "2-3 hrs", desc: "Ceiling cassette type servicing and deep filter clean." },
  { id: "central",       name: "Central AC System",     icon: "system", price: 120, priceUnit: "/visit", duration: "4-6 hrs", desc: "Full ducted system inspection and sanitisation." },
  { id: "deep-clean",    name: "Deep Clean",            icon: "clean",  price: 65,  priceUnit: "/unit",  duration: "3-4 hrs", desc: "Chemical-free deep clean with antibacterial treatment." },
  { id: "chemical-wash", name: "Chemical Wash",         icon: "wash",   price: 80,  priceUnit: "/unit",  duration: "3-5 hrs", desc: "Heavy-duty chemical wash for heavily soiled units." },
];

export const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00",
  "13:00", "14:00", "15:00", "16:00",
];

export const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "Pending", confirmed: "Confirmed",
  "in-progress": "In Progress", completed: "Completed", cancelled: "Cancelled",
};

export const STATUS_COLOR: Record<BookingStatus, string> = {
  pending:       "bg-yellow-100 text-yellow-800",
  confirmed:     "bg-blue-100 text-blue-800",
  "in-progress": "bg-purple-100 text-purple-800",
  completed:     "bg-green-100 text-green-800",
  cancelled:     "bg-red-100 text-red-800",
};
