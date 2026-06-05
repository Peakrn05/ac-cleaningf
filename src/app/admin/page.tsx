"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import { useAuth } from "@/context/auth/AuthProvider";
import { useBooking } from "@/context/booking/BookingProvider";
import {
  SERVICES, STATUS_COLOR, STATUS_LABEL, TIME_SLOTS,
  type Booking, type BookingStatus,
} from "@/types/app/booking";
import { CalendarDays, CheckCircle, Clock, Users, ChevronDown } from "lucide-react";
import dayjs from "dayjs";

const ALL_STATUSES: BookingStatus[] = ["pending", "confirmed", "in-progress", "completed", "cancelled"];

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const { bookings, updateStatus } = useBooking();
  const router = useRouter();
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [dateFilter, setDateFilter] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) router.push("/login");
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "admin") return null;

  const filtered = bookings.filter((b: Booking) => {
    if (filter !== "all" && b.status !== filter) return false;
    if (dateFilter && b.date !== dateFilter) return false;
    return true;
  });

  const revenue = bookings
    .filter((b: Booking) => b.status === "completed")
    .reduce((s: number, b: Booking) => s + b.total, 0);

  const stats = [
    { label: "Total Bookings", value: bookings.length,                                                                icon: CalendarDays, color: "text-brand-600" },
    { label: "Pending",        value: bookings.filter((b: Booking) => b.status === "pending").length,                icon: Clock,        color: "text-amber-500" },
    { label: "Confirmed",      value: bookings.filter((b: Booking) => b.status === "confirmed").length,              icon: CheckCircle,  color: "text-blue-500"  },
    { label: "Revenue",        value: `$${revenue}`,                                                                 icon: Users,        color: "text-green-600" },
  ];

  const todayStr = dayjs().format("YYYY-MM-DD");
  const todayBookings = bookings.filter((b: Booking) => b.date === todayStr && b.status !== "cancelled");

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage all AC cleaning bookings</p>
          </div>
          <Link href="/book" className="bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-700 transition-colors">
            + New Booking
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">{label}</p>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-5">
          {(["all", ...ALL_STATUSES] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                filter === s ? "bg-brand-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-brand-300"
              }`}>
              {s === "all"
                ? `All (${bookings.length})`
                : `${STATUS_LABEL[s as BookingStatus]} (${bookings.filter((b: Booking) => b.status === s).length})`}
            </button>
          ))}
          <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
          {dateFilter && (
            <button onClick={() => setDateFilter("")} className="text-sm text-slate-400 hover:text-slate-600 px-2">Clear ×</button>
          )}
        </div>

        {/* Bookings Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-8">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-4xl mb-3">📋</p><p>No bookings match this filter</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-xs text-slate-500 uppercase tracking-wider">
                    {["Ref", "Customer", "Service", "Units", "Date", "Time", "Total", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((b: Booking) => {
                    const svc = SERVICES.find((s) => s.id === b.service);
                    return (
                      <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-slate-400">#{b.id.slice(0, 8).toUpperCase()}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-800">{b.userName}</p>
                          <p className="text-xs text-slate-400">{b.userEmail}</p>
                          {b.userPhone && <p className="text-xs text-slate-400">{b.userPhone}</p>}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">{svc?.icon} {svc?.name}</td>
                        <td className="px-4 py-3 text-center">{b.units}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{dayjs(b.date).format("D MMM YYYY")}</td>
                        <td className="px-4 py-3">{b.timeSlot}</td>
                        <td className="px-4 py-3 font-bold">${b.total}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_COLOR[b.status]}`}>
                            {STATUS_LABEL[b.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="relative">
                            <button
                              onClick={() => setOpenMenu(openMenu === b.id ? null : b.id)}
                              className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:border-brand-300 hover:text-brand-600 transition-colors"
                            >
                              Update <ChevronDown className="w-3 h-3" />
                            </button>
                            {openMenu === b.id && (
                              <div className="absolute right-0 top-8 z-20 bg-white border border-slate-200 rounded-xl shadow-lg py-1 min-w-[150px] animate-fade-in">
                                {ALL_STATUSES.filter((s) => s !== b.status).map((s) => (
                                  <button key={s} onClick={() => { updateStatus(b.id, s); setOpenMenu(null); }}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-brand-50 hover:text-brand-700 transition-colors capitalize">
                                    → {STATUS_LABEL[s]}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Today's Queue */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4">📅 Today&apos;s Queue</h2>
          {todayBookings.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400">
              <p className="text-3xl mb-2">🗓️</p><p>No bookings scheduled for today</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {TIME_SLOTS.map((slot) => {
                const slotBookings = todayBookings.filter((b: Booking) => b.timeSlot === slot);
                return (
                  <div key={slot} className={`bg-white border rounded-xl p-3 ${slotBookings.length > 0 ? "border-brand-300 shadow-sm" : "border-slate-200"}`}>
                    <p className="text-xs font-bold text-slate-600 mb-2">🕐 {slot}</p>
                    {slotBookings.length === 0 ? (
                      <p className="text-xs text-slate-300">Free</p>
                    ) : (
                      slotBookings.map((b: Booking) => {
                        const svc = SERVICES.find((s) => s.id === b.service);
                        return (
                          <div key={b.id} className="text-xs space-y-0.5">
                            <p className="font-semibold text-slate-800 truncate">{b.userName}</p>
                            <p className="text-slate-500">{svc?.icon} {svc?.name}</p>
                            <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${STATUS_COLOR[b.status]}`}>
                              {STATUS_LABEL[b.status]}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
