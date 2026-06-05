"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import { useAuth } from "@/context/auth/AuthProvider";
import { useBooking } from "@/context/booking/BookingProvider";
import { SERVICES, TIME_SLOTS, type ServiceId } from "@/types/app/booking";
import { CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";
import dayjs from "dayjs";

type Step = 1 | 2 | 3 | 4;

interface FormState {
  service: ServiceId | "";
  units: number;
  date: string;
  timeSlot: string;
  name: string; email: string; phone: string; address: string; notes: string;
}

const STEPS = ["Service", "Schedule", "Details", "Confirm"];
const today = dayjs().format("YYYY-MM-DD");
const maxDate = dayjs().add(60, "day").format("YYYY-MM-DD");

export default function BookPage() {
  const { user } = useAuth();
  const { addBooking } = useBooking();
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>({
    service: "", units: 1, date: "", timeSlot: "",
    name: user?.name ?? "", email: user?.email ?? "",
    phone: user?.phone ?? "", address: "", notes: "",
  });
  const [confirmed, setConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState("");

  const set = (k: keyof FormState, v: string | number) => setForm((f) => ({ ...f, [k]: v }));
  const svc = SERVICES.find((s) => s.id === form.service);
  const total = svc ? svc.price * form.units : 0;

  const canNext = () => {
    if (step === 1) return !!form.service;
    if (step === 2) return !!form.date && !!form.timeSlot;
    if (step === 3) return !!form.name.trim() && !!form.email.trim() && !!form.address.trim();
    return true;
  };

  const handleConfirm = () => {
    if (!user) { router.push("/login"); return; }
    const b = addBooking({
      userId: user.id, userName: form.name, userEmail: form.email, userPhone: form.phone,
      service: form.service as ServiceId, units: form.units, date: form.date,
      timeSlot: form.timeSlot, address: form.address, notes: form.notes,
      status: "pending", total,
    });
    setBookingId(b.id);
    setConfirmed(true);
  };

  if (confirmed) return (
    <div className="min-h-screen bg-brand-50"><Navbar />
      <div className="max-w-lg mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Booking Confirmed! 🎉</h1>
        <p className="text-slate-500 mb-1">Reference: <span className="font-mono font-bold text-brand-600">#{bookingId.slice(0,8).toUpperCase()}</span></p>
        <p className="text-slate-500 mb-8">{svc?.name} · {dayjs(form.date).format("ddd D MMM")} at {form.timeSlot}</p>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left mb-8 text-sm">
          {[
            ["Service", `${svc?.icon} ${svc?.name}`],
            ["Units", String(form.units)],
            ["Date", dayjs(form.date).format("dddd, D MMMM YYYY")],
            ["Time", form.timeSlot],
            ["Address", form.address],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
              <span className="text-slate-500">{k}</span><span className="font-medium text-right ml-4">{v}</span>
            </div>
          ))}
          <div className="flex justify-between pt-3 font-bold text-lg"><span>Total</span><span className="text-brand-600">${total}</span></div>
        </div>
        <div className="flex gap-3 justify-center">
          <Link href="/dashboard" className="px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors">View My Bookings</Link>
          <Link href="/" className="px-6 py-3 border border-slate-300 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">Back to Home</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-50"><Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Book a Service</h1>
          <p className="text-slate-500 mt-1">Fast online booking in 4 easy steps</p>
        </div>

        {/* Step bar */}
        <div className="flex items-center justify-center mb-8">
          {STEPS.map((label, i) => {
            const n = (i + 1) as Step;
            const done = step > n; const active = step === n;
            return (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    done ? "bg-green-500 text-white" : active ? "bg-brand-600 text-white ring-4 ring-brand-100" : "bg-white border-2 border-slate-300 text-slate-400"
                  }`}>
                    {done ? "✓" : n}
                  </div>
                  <span className={`text-xs mt-1 font-medium ${active ? "text-brand-600" : "text-slate-400"}`}>{label}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`h-0.5 w-10 sm:w-16 mx-1 mb-4 ${step > n ? "bg-green-400" : "bg-slate-200"}`} />}
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 animate-slide-up">

          {/* Step 1: Service */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4">Choose a Service</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICES.map((s) => (
                  <button key={s.id} onClick={() => set("service", s.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      form.service === s.id ? "border-brand-500 bg-brand-50" : "border-slate-200 hover:border-brand-300 hover:bg-slate-50"
                    }`}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{s.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm">{s.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
                        <div className="flex justify-between mt-2">
                          <span className="text-brand-600 font-bold text-sm">${s.price}<span className="text-xs font-normal text-slate-400">{s.priceUnit}</span></span>
                          <span className="text-xs text-slate-400">⏱ {s.duration}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {form.service && (
                <div className="mt-5 p-4 bg-brand-50 rounded-xl border border-brand-100">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Number of Units</label>
                  <div className="flex items-center gap-4">
                    <button onClick={() => set("units", Math.max(1, form.units - 1))}
                      className="w-10 h-10 rounded-xl bg-white border border-slate-300 text-xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center">−</button>
                    <span className="text-2xl font-bold text-slate-800 w-8 text-center">{form.units}</span>
                    <button onClick={() => set("units", Math.min(10, form.units + 1))}
                      className="w-10 h-10 rounded-xl bg-white border border-slate-300 text-xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center">+</button>
                    <span className="text-slate-500 text-sm ml-2">
                      Total: <strong className="text-brand-600">${svc ? svc.price * form.units : 0}</strong>
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Schedule */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4">Choose Date & Time</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">📅 Preferred Date</label>
                  <input type="date" min={today} max={maxDate} value={form.date}
                    onChange={(e) => { set("date", e.target.value); set("timeSlot", ""); }}
                    className="border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  {form.date && <p className="text-xs text-slate-500 mt-1">{dayjs(form.date).format("dddd, MMMM D, YYYY")}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">🕐 Time Slot</label>
                  <div className="grid grid-cols-4 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button key={slot} onClick={() => set("timeSlot", slot)}
                        className={`py-3 rounded-xl text-sm font-medium border transition-all ${
                          form.timeSlot === slot ? "bg-brand-600 text-white border-brand-600" : "bg-white border-slate-200 text-slate-700 hover:border-brand-400"
                        }`}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4">Your Details</h2>
              {!user && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-sm text-amber-800">
                  💡 <Link href="/login" className="font-semibold underline">Sign in</Link> to auto-fill your details and track this booking.
                </div>
              )}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                    <input type="text" required value={form.name} onChange={(e) => set("name", e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="John Smith" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                    <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="+1 234 567 8900" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                  <input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Service Address *</label>
                  <textarea required value={form.address} onChange={(e) => set("address", e.target.value)} rows={2}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                    placeholder="Full address including unit/floor number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Notes (optional)</label>
                  <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={2}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                    placeholder="e.g. Gate code, specific AC issue..." />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4">Review & Confirm</h2>
              <div className="space-y-1">
                {[
                  ["Service", `${svc?.icon} ${svc?.name}`],
                  ["Units", String(form.units)],
                  ["Date", dayjs(form.date).format("dddd, D MMMM YYYY")],
                  ["Time", form.timeSlot],
                  ["Name", form.name],
                  ["Email", form.email],
                  ["Phone", form.phone || "—"],
                  ["Address", form.address],
                  ...(form.notes ? [["Notes", form.notes]] : []),
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2.5 border-b border-slate-100 text-sm">
                    <span className="text-slate-500 font-medium shrink-0">{k}</span>
                    <span className="text-slate-800 text-right ml-4">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-4 text-xl font-bold text-slate-800">
                  <span>Total</span><span className="text-brand-600">${total}</span>
                </div>
              </div>
              {!user && (
                <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                  ⚠️ You must be signed in to confirm.{" "}
                  <Link href="/login" className="font-bold underline">Sign in</Link> or{" "}
                  <Link href="/register" className="font-bold underline">register</Link>.
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-100">
            <button onClick={() => setStep((s) => Math.max(1, s - 1) as Step)} disabled={step === 1}
              className="flex items-center gap-1 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            {step < 4 ? (
              <button onClick={() => setStep((s) => (s + 1) as Step)} disabled={!canNext()}
                className="flex items-center gap-1 px-6 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-bold hover:bg-brand-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleConfirm} disabled={!user}
                className="px-8 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                ✓ Confirm Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
