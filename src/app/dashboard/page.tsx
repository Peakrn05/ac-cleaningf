"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import ServiceIcon from "@/components/common/ServiceIcon";
import { useAuth } from "@/context/auth/AuthProvider";
import { useBooking } from "@/context/booking/BookingProvider";
import { useLang } from "@/context/lang/LangProvider";
import { SERVICES, STATUS_COLOR, STATUS_LABEL, TIME_SLOTS, type Booking } from "@/types/app/booking";
import { CalendarDays, Clock, MapPin, Plus } from "lucide-react";
import dayjs from "dayjs";

function BookingCard({ b, onCancel, onPostpone }: { b: Booking; onCancel: () => void; onPostpone: (date: string, timeSlot: string) => void }) {
  const { t } = useLang();
  const [editing, setEditing] = useState(false);
  const [date, setDate] = useState(b.date);
  const [timeSlot, setTimeSlot] = useState(b.timeSlot);
  const svc = SERVICES.find((s) => s.id === b.service);
  const canPostpone = ["pending", "confirmed", "in-progress"].includes(b.status);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-sm transition-shadow animate-slide-up">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
            <ServiceIcon id={b.service} className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-800">{svc?.name}</p>
            <p className="text-xs text-slate-400 font-mono">#{b.id.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLOR[b.status]}`}>
          {STATUS_LABEL[b.status]}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
        <div className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5 text-slate-400" />{dayjs(b.date).format("D MMM YYYY")}</div>
        <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" />{b.timeSlot}</div>
        <div className="flex items-center gap-1.5 col-span-2 truncate"><MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /><span className="truncate">{b.address}</span></div>
      </div>

      <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-100">
        <span className="text-sm text-slate-500">
          {b.units} unit{b.units > 1 ? "s" : ""} - {(b.btu ?? 5000).toLocaleString()} BTU - <strong className="text-slate-800">${b.total}</strong>
        </span>
        <div className="flex gap-2 shrink-0">
          {canPostpone && (
            <button type="button" onClick={() => setEditing((v) => !v)} className="text-xs text-brand-600 border border-brand-200 px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors">
              {t.postpone}
            </button>
          )}
          {b.status === "pending" && (
            <button type="button" onClick={onCancel} className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
              {t.cancel}
            </button>
          )}
        </div>
      </div>

      {editing && (
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
          <input
            type="date"
            min={dayjs().format("YYYY-MM-DD")}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {TIME_SLOTS.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
          </select>
          <button
            type="button"
            onClick={() => { onPostpone(date, timeSlot); setEditing(false); }}
            className="bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-700"
          >
            {t.saveSchedule}
          </button>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const { getUserBookings, updateStatus, updateSchedule } = useBooking();
  const { t } = useLang();
  const router = useRouter();

  useEffect(() => { if (!isLoading && !user) router.push("/login"); }, [user, isLoading, router]);
  if (isLoading || !user) return null;

  const bookings = getUserBookings(user.id);
  const active = bookings.filter((b) => ["pending", "confirmed", "in-progress"].includes(b.status));
  const history = bookings.filter((b) => ["completed", "cancelled"].includes(b.status));

  return (
    <div className="min-h-screen bg-brand-50"><Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{t.dashboardTitle}</h1>
            <p className="text-slate-500 mt-1">{t.welcomeBackName} {user.name}</p>
          </div>
          <Link href="/book" className="flex items-center gap-2 bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-700 transition-colors text-sm">
            <Plus className="w-4 h-4" /> {t.newBooking}
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: t.totalBookings, value: bookings.length, color: "text-brand-600" },
            { label: t.active, value: active.length, color: "text-amber-600" },
            { label: t.completed, value: bookings.filter((b) => b.status === "completed").length, color: "text-green-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-2xl p-5 text-center">
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
              <p className="text-slate-500 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>

        {active.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-700 mb-4">{t.activeBookings}</h2>
            <div className="space-y-4">
              {active.map((b) => (
                <BookingCard
                  key={b.id}
                  b={b}
                  onCancel={() => { if (confirm(t.cancelBookingConfirm)) updateStatus(b.id, "cancelled"); }}
                  onPostpone={(date, timeSlot) => updateSchedule(b.id, date, timeSlot)}
                />
              ))}
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-700 mb-4">{t.history}</h2>
            <div className="space-y-3">
              {history.map((b) => <BookingCard key={b.id} b={b} onCancel={() => {}} onPostpone={() => {}} />)}
            </div>
          </div>
        )}

        {bookings.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-slate-700 mb-2">{t.noBookingsYet}</h3>
            <p className="text-slate-500 mb-6">{t.noBookingsDesc}</p>
            <Link href="/book" className="inline-block bg-brand-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-brand-700 transition-colors">
              {t.bookFirstService}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
