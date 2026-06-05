"use client";
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Booking, BookingStatus } from "@/types/app/booking";

interface BookingCtx {
  bookings: Booking[];
  addBooking: (b: Omit<Booking, "id" | "createdAt">) => Booking;
  updateStatus: (id: string, status: BookingStatus) => void;
  updateSchedule: (id: string, date: string, timeSlot: string) => void;
  getUserBookings: (userId: string) => Booking[];
}

const Ctx = createContext<BookingCtx | null>(null);
const KEY = "ac-bookings-v1";

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setBookings(JSON.parse(raw).map((b: Booking) => ({ ...b, btu: b.btu ?? 5000 })));
    } catch {}
  }, []);
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(bookings)); }, [bookings]);

  const addBooking = useCallback((data: Omit<Booking, "id" | "createdAt">): Booking => {
    const b: Booking = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    setBookings((prev) => [b, ...prev]); return b;
  }, []);

  const updateStatus = useCallback((id: string, status: BookingStatus) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  }, []);

  const updateSchedule = useCallback((id: string, date: string, timeSlot: string) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, date, timeSlot } : b)));
  }, []);

  const getUserBookings = useCallback((userId: string) => bookings.filter((b) => b.userId === userId), [bookings]);

  return <Ctx.Provider value={{ bookings, addBooking, updateStatus, updateSchedule, getUserBookings }}>{children}</Ctx.Provider>;
}

export const useBooking = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBooking outside BookingProvider");
  return ctx;
};
