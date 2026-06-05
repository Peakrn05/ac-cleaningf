"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import ServiceIcon from "@/components/common/ServiceIcon";
import { useAuth } from "@/context/auth/AuthProvider";
import { useBooking } from "@/context/booking/BookingProvider";
import { useLang } from "@/context/lang/LangProvider";
import { SERVICES, STATUS_COLOR, STATUS_LABEL, type Booking } from "@/types/app/booking";
import { CalendarDays, Clock, MapPin, Plus } from "lucide-react";
import dayjs from "dayjs";

function BookingCard({ b, onCancel }: { b: Booking; onCancel: () => void }) {
  const { t } = useLang();
  const svc = SERVICES.find((s) => s.id === b.service);
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
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <span className="text-sm text-slate-500">{b.units} unit{b.units > 1 ? "s" : ""} · <strong className="text-slate-800">${b.total}</strong></span>
        {b.status === "pending" && (
          <button onClick={onCancel} className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
            {t.cancel}
          </button>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const { getUserBookings, updateStatus } = useBooking();
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

        {/* Stats */}
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
              {active.map((b) => <BookingCard key={b.id} b={b} onCancel={() => { if (confirm(t.cancelBookingConfirm)) updateStatus(b.id, "cancelled"); }} />)}
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-700 mb-4">{t.history}</h2>
            <div className="space-y-3">
              {history.map((b) => <BookingCard key={b.id} b={b} onCancel={() => {}} />)}
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
