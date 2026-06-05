"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import PhoneInput from "@/components/common/PhoneInput";
import ServiceIcon from "@/components/common/ServiceIcon";
import { useAuth } from "@/context/auth/AuthProvider";
import { useBooking } from "@/context/booking/BookingProvider";
import { useLang, validateEmail } from "@/context/lang/LangProvider";
import { calculateBookingTotal, getBtuMultiplier, SERVICES, TIME_SLOTS, type ServiceId } from "@/types/app/booking";
import { Banknote, CheckCircle, ChevronRight, ChevronLeft, Lock, CreditCard, User, Wallet } from "lucide-react";
import dayjs from "dayjs";

type Step = 1 | 2 | 3 | 4 | 5;
type PayMethod = "paypal" | "credit" | "debit";

interface FormState {
  service: ServiceId | ""; units: number; btu: number; date: string; timeSlot: string;
  name: string; email: string; phone: string; address: string; notes: string;
}
interface CardState { number: string; holder: string; expiry: string; cvv: string; }

const today = dayjs().format("YYYY-MM-DD");
const maxDate = dayjs().add(60, "day").format("YYYY-MM-DD");

function formatCardNumber(v: string) { return v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim(); }
function formatExpiry(v: string) { const d=v.replace(/\D/g,"").slice(0,4); return d.length>=3?`${d.slice(0,2)}/${d.slice(2)}`:d; }
function getCardBrand(n: string) { const d=n.replace(/\s/g,""); if(/^4/.test(d))return"VISA"; if(/^5[1-5]/.test(d))return"MC"; if(/^3[47]/.test(d))return"AMEX"; return""; }

export default function BookPage() {
  const { user } = useAuth();
  const { addBooking } = useBooking();
  const { t } = useLang();

  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>({
    service: "", units: 1, btu: 5000, date: "", timeSlot: "",
    name: user?.name ?? "", email: user?.email ?? "",
    phone: user?.phone ?? "", address: "", notes: "",
  });
  const [emailErr, setEmailErr] = useState("");
  const [payMethod, setPayMethod] = useState<PayMethod>("credit");
  const [card, setCard] = useState<CardState>({ number: "", holder: "", expiry: "", cvv: "" });
  const [paying, setPaying] = useState(false);
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState("");

  const set = (k: keyof FormState, v: string | number) => setForm((f) => ({ ...f, [k]: v }));
  const setC = (k: keyof CardState, v: string) => setCard((c) => ({ ...c, [k]: v }));

  const svc = SERVICES.find((s) => s.id === form.service);
  const total = svc ? calculateBookingTotal(svc.price, form.units, form.btu) : 0;
  const cardBrand = getCardBrand(card.number);

  const validateStep3 = () => {
    if (!validateEmail(form.email)) { setEmailErr(t.invalidEmail); return false; }
    setEmailErr(""); return true;
  };

  const canNext = (): boolean => {
    if (step === 1) return !!form.service;
    if (step === 2) return !!form.date && !!form.timeSlot;
    if (step === 3) return !!form.name.trim() && !!form.email.trim() && !!form.address.trim();
    return true; // step 4: guests allowed
  };

  const handleNextFromStep3 = () => {
    if (!validateStep3()) return;
    setStep(4);
  };

  const canPay = (): boolean => {
    if (payMethod === "paypal") return true;
    return card.number.replace(/\s/g,"").length===16 && card.holder.trim().length>2 && card.expiry.length===5 && card.cvv.length>=3;
  };

  const doConfirm = () => {
    const b = addBooking({
      userId: user?.id ?? "guest",
      userName: form.name, userEmail: form.email, userPhone: form.phone,
      service: form.service as ServiceId, units: form.units, btu: form.btu,
      date: form.date, timeSlot: form.timeSlot,
      address: form.address, notes: form.notes,
      status: "confirmed", total,
    });
    setBookingId(b.id);
    setConfirmed(true);
  };

  const handleCardPay = async () => {
    setPaying(true);
    await new Promise((r) => setTimeout(r, 2000));
    setPaying(false);
    doConfirm();
  };

  const handlePayPal = async () => {
    setPaypalLoading(true);
    await new Promise((r) => setTimeout(r, 2500));
    setPaypalLoading(false);
    doConfirm();
  };

  const STEPS = [t.service, t.schedule, t.details, t.review, t.payment];

  /* Success */
  if (confirmed) return (
    <div className="min-h-screen bg-slate-100"><Navbar />
      <div className="max-w-lg mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{t.confirmBooking}</h1>
        <p className="text-slate-500 mb-1">Ref: <span className="font-mono font-bold text-brand-600">#{bookingId.slice(0,8).toUpperCase()}</span></p>
        <p className="text-slate-500 mb-8">{svc?.name} · {dayjs(form.date).format("ddd D MMM")} {form.timeSlot}</p>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left mb-6 text-sm">
          {[[t.service, svc?.name ?? ""], [t.units, String(form.units)], [t.btuCapacity, `${form.btu.toLocaleString()} BTU`], [t.date, dayjs(form.date).format("dddd, D MMMM YYYY")], [t.time, form.timeSlot], [t.address, form.address]].map(([k,v])=>(
            <div key={k} className="flex justify-between py-2.5 border-b border-slate-100 last:border-0">
              <span className="text-slate-500">{k}</span><span className="font-medium text-right ml-4">{v}</span>
            </div>
          ))}
          <div className="flex justify-between pt-3 font-bold text-lg"><span>{t.total}</span><span className="text-green-600">${total}</span></div>
        </div>
        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-4 py-2 rounded-full mb-8">
          <CheckCircle className="w-3.5 h-3.5" />
          {t.payWith} {payMethod === "paypal" ? "PayPal" : payMethod === "credit" ? "Credit Card" : "Debit Card"}
        </div>
        <div className="flex gap-3 justify-center flex-wrap">
          {user
            ? <Link href="/dashboard" className="px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors">{t.viewBookings}</Link>
            : <Link href="/register" className="px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors">{t.register}</Link>
          }
          <Link href="/" className="px-6 py-3 border border-slate-300 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">{t.backHome}</Link>
        </div>
      </div>
    </div>
  );

  /* Main wizard */
  return (
    <div className="min-h-screen bg-slate-100"><Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">{t.bookAService}</h1>
          <p className="text-slate-500 mt-1">{t.easySteps}</p>
        </div>

        {/* Step bar */}
        <div className="flex items-center justify-center mb-8 overflow-x-auto pb-1">
          {STEPS.map((label, i) => {
            const n=(i+1) as Step; const done=step>n; const active=step===n;
            return (
              <div key={label} className="flex items-center shrink-0">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${done?"bg-green-500 text-white":active?"bg-brand-600 text-white ring-4 ring-brand-100":"bg-white border-2 border-slate-300 text-slate-400"}`}>
                    {done?"✓":n}
                  </div>
                  <span className={`text-xs mt-1 font-medium whitespace-nowrap ${active?"text-brand-600":"text-slate-400"}`}>{label}</span>
                </div>
                {i<STEPS.length-1 && <div className={`h-0.5 w-7 sm:w-12 mx-1 mb-4 ${step>n?"bg-green-400":"bg-slate-200"}`} />}
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 animate-slide-up">

          {/* Step 1 */}
          {step===1 && (
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4">{t.chooseService}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICES.map((s)=>(
                  <button key={s.id} onClick={()=>set("service",s.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${form.service===s.id?"border-brand-500 bg-brand-50":"border-slate-200 hover:border-brand-300"}`}>
                    <div className="flex items-start gap-3">
                      <span className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                        <ServiceIcon id={s.id} className="w-5 h-5" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm">{s.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
                        <div className="flex justify-between mt-2">
                          <span className="text-brand-600 font-bold text-sm">${s.price}<span className="text-xs font-normal text-slate-400">{s.priceUnit}</span></span>
                          <span className="text-xs text-slate-400">{s.duration}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {form.service && (
                <div className="mt-5 p-4 bg-brand-50 rounded-xl border border-brand-100">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">{t.numberOfUnits}</label>
                  <div className="flex items-center gap-4">
                    <button onClick={()=>set("units",Math.max(1,form.units-1))} className="w-10 h-10 rounded-xl bg-white border border-slate-300 text-xl font-bold hover:bg-slate-50 flex items-center justify-center">−</button>
                    <span className="text-2xl font-bold w-8 text-center">{form.units}</span>
                    <button onClick={()=>set("units",Math.min(10,form.units+1))} className="w-10 h-10 rounded-xl bg-white border border-slate-300 text-xl font-bold hover:bg-slate-50 flex items-center justify-center">+</button>
                    <span className="text-slate-500 text-sm ml-2">Total: <strong className="text-brand-600">${total}</strong></span>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t.btuCapacity}</label>
                    <select
                      value={form.btu}
                      onChange={(e)=>set("btu", Number(e.target.value))}
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value={4500}>{t.btuSmall}</option>
                      <option value={9000}>{t.btuMedium}</option>
                      <option value={18000}>{t.btuLarge}</option>
                      <option value={30000}>{t.btuXLarge}</option>
                    </select>
                    <p className="text-xs text-slate-500 mt-1">{t.btuHelp}</p>
                    <p className="text-xs text-brand-700 mt-1">{t.sizeSurcharge}: {Math.round((getBtuMultiplier(form.btu) - 1) * 100)}%</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2 */}
          {step===2 && (
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4">{t.chooseDateTime}</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">{t.preferredDate}</label>
                  <input type="date" min={today} max={maxDate} value={form.date}
                    onChange={(e)=>{set("date",e.target.value);set("timeSlot","");}}
                    className="border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  {form.date && <p className="text-xs text-slate-500 mt-1">{dayjs(form.date).format("dddd, MMMM D, YYYY")}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">{t.timeSlot}</label>
                  <div className="grid grid-cols-4 gap-2">
                    {TIME_SLOTS.map((slot)=>(
                      <button key={slot} onClick={()=>set("timeSlot",slot)}
                        className={`py-3 rounded-xl text-sm font-medium border transition-all ${form.timeSlot===slot?"bg-brand-600 text-white border-brand-600":"bg-white border-slate-200 text-slate-700 hover:border-brand-400"}`}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step===3 && (
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4">{t.yourDetails}</h2>

              {/* Guest mode notice */}
              {!user && (
                <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-5 text-sm text-sky-800 flex items-start gap-2">
                  <User className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>{t.guestNote}<Link href="/register" className="font-bold underline">{t.guestNoteLink}</Link>{t.guestNoteEnd}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t.nameStar}</label>
                    <input type="text" required value={form.name} onChange={(e)=>set("name",e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder={t.namePlaceholder} />
                  </div>
                  <PhoneInput
                    value={form.phone}
                    onChange={(v)=>set("phone",v)}
                    label={t.phone}
                    placeholder="000 000 0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.emailStar}</label>
                  <input type="email" required value={form.email}
                    onChange={(e)=>{set("email",e.target.value); if(emailErr) setEmailErr("");}}
                    onBlur={()=>form.email&&!validateEmail(form.email)?setEmailErr(t.invalidEmail):setEmailErr("")}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${emailErr?"border-red-400 bg-red-50":"border-slate-300"}`}
                    placeholder={t.emailPlaceholder} />
                  {emailErr && <p className="text-red-500 text-xs mt-1">{emailErr}</p>}
                  {form.email && !emailErr && validateEmail(form.email) && (
                    <p className="text-green-600 text-xs mt-1 flex items-center gap-1"><CheckCircle className="w-3 h-3"/>Valid email</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.address} *</label>
                  <textarea required value={form.address} onChange={(e)=>set("address",e.target.value)} rows={2}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                    placeholder={t.addressPlaceholder} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.notes}</label>
                  <textarea value={form.notes} onChange={(e)=>set("notes",e.target.value)} rows={2}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                    placeholder={t.notesPlaceholder} />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step===4 && (
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4">{t.reviewOrder}</h2>
              <div className="space-y-0.5">
                {[[t.service, svc?.name ?? ""], [t.units, String(form.units)], [t.btuCapacity, `${form.btu.toLocaleString()} BTU`], [t.date, dayjs(form.date).format("dddd, D MMMM YYYY")], [t.time, form.timeSlot],
                  ["Name",form.name],["Email",form.email],["Phone",form.phone||"—"],["Address",form.address],
                  ...(form.notes?[["Notes",form.notes]]:[])].map(([k,v])=>(
                  <div key={k} className="flex justify-between py-2.5 border-b border-slate-100 text-sm">
                    <span className="text-slate-500 font-medium shrink-0">{k}</span>
                    <span className="text-slate-800 text-right ml-4">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-4 text-xl font-bold text-slate-800">
                  <span>{t.amountDue}</span><span className="text-brand-600">${total}</span>
                </div>
              </div>
              {/* Guest mode — no block, just info */}
              {!user && (
                <div className="mt-4 p-3 bg-sky-50 border border-sky-200 rounded-xl text-sm text-sky-800 flex items-center gap-2">
                  <User className="w-4 h-4 shrink-0" />
                  <span>{t.continueAsGuest} · <Link href="/login" className="font-bold underline">{t.signIn}</Link></span>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Payment */}
          {step===5 && (
            <div>
              <div className="flex items-center gap-2 mb-5">
                <h2 className="text-xl font-bold text-slate-800">{t.securePayment}</h2>
                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full font-semibold">
                  <Lock className="w-3 h-3" /> {t.sslEncrypted}
                </span>
              </div>

              {/* Summary pill */}
              <div className="bg-brand-50 border border-brand-100 rounded-xl px-5 py-3 mb-5 flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  <span className="font-semibold inline-flex items-center gap-2">
                    {form.service && <ServiceIcon id={form.service as ServiceId} className="w-4 h-4" />}
                    {svc?.name}
                  </span>
                  <span className="mx-2 text-slate-400">-</span>{form.units} {t.units}
                  <span className="mx-2 text-slate-400">-</span>{form.btu.toLocaleString()} BTU
                  <span className="mx-2 text-slate-400">-</span>{dayjs(form.date).format("D MMM")} {form.timeSlot}
                </div>
                <span className="text-brand-600 font-bold text-lg">${total}</span>
              </div>

              {/* Method tabs */}
              <div className="flex gap-2 mb-5">
                {([{id:"paypal" as PayMethod,label:"PayPal",icon:Wallet},{id:"credit" as PayMethod,label:"Credit Card",icon:CreditCard},{id:"debit" as PayMethod,label:"Debit Card",icon:Banknote}] as const).map((m)=>(
                  <button key={m.id} onClick={()=>setPayMethod(m.id)}
                    className={`flex-1 flex flex-col items-center py-3 rounded-xl border-2 text-sm font-medium transition-all ${payMethod===m.id?"border-brand-500 bg-brand-50 text-brand-700":"border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                    <m.icon className="w-5 h-5 mb-1" />
                    <span className="text-xs">{m.label}</span>
                  </button>
                ))}
              </div>

              {/* PayPal */}
              {payMethod==="paypal" && (
                <div className="space-y-3">
                  <div className="bg-[#f5f7fa] border border-slate-200 rounded-xl p-6 text-center">
                    <p className="text-slate-600 text-sm mb-1">Pay via PayPal</p>
                    <p className="text-3xl font-bold text-[#003087] mb-4">${total}</p>
                    <button onClick={handlePayPal} disabled={paypalLoading}
                      className="w-full bg-[#ffc439] hover:bg-[#f0b429] text-[#003087] font-bold py-4 rounded-xl disabled:opacity-70 flex items-center justify-center gap-2 text-base">
                      {paypalLoading
                        ? <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>{t.connectingPaypal}</>
                        : <><Wallet className="w-5 h-5" /> {t.payWithPaypal} ${total}</>}
                    </button>
                  </div>
                </div>
              )}

              {/* Card */}
              {(payMethod==="credit"||payMethod==="debit") && (
                <div className="space-y-4">
                  {/* Card preview */}
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden select-none"
                    style={{background:"linear-gradient(135deg,#c2520a 0%,#ea6c00 60%,#fb923c 100%)"}}>
                    <div className="absolute top-5 left-6 right-6 flex items-center justify-between">
                      <span className="text-white/80 text-sm font-semibold tracking-widest uppercase">{payMethod}</span>
                      <span className="text-white font-bold text-lg">{cardBrand || "CARD"}</span>
                    </div>
                    <div className="absolute top-16 left-6 right-6">
                      <p className="text-white font-mono text-xl tracking-[0.2em] font-bold">{card.number||"•••• •••• •••• ••••"}</p>
                    </div>
                    <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
                      <div>
                        <p className="text-white/60 text-xs uppercase mb-0.5">Card Holder</p>
                        <p className="text-white font-semibold text-sm uppercase">{card.holder||"YOUR NAME"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60 text-xs uppercase mb-0.5">Expires</p>
                        <p className="text-white font-semibold text-sm">{card.expiry||"MM/YY"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1"><CreditCard className="w-4 h-4 inline mr-1"/>{t.cardNumber}</label>
                      <input type="text" inputMode="numeric" value={card.number} maxLength={19}
                        onChange={(e)=>setC("number",formatCardNumber(e.target.value))}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 tracking-widest"
                        placeholder="1234 5678 9012 3456" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t.cardHolder}</label>
                      <input type="text" value={card.holder} onChange={(e)=>setC("holder",e.target.value.toUpperCase())}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="JOHN SMITH" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t.expiry}</label>
                        <input type="text" inputMode="numeric" value={card.expiry} maxLength={5}
                          onChange={(e)=>setC("expiry",formatExpiry(e.target.value))}
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
                          placeholder="MM/YY" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t.cvv}</label>
                        <input type="password" inputMode="numeric" value={card.cvv} maxLength={4}
                          onChange={(e)=>setC("cvv",e.target.value.replace(/\D/g,"").slice(0,4))}
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
                          placeholder="•••" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-400">Accepted:</span>
                    {["VISA","MC","AMEX","JCB","UnionPay"].map((c)=>(
                      <span key={c} className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{c}</span>
                    ))}
                  </div>

                  <button onClick={handleCardPay} disabled={!canPay()||paying}
                    className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-2 text-base">
                    {paying
                      ? <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>{t.processingPayment}</>
                      : <><Lock className="w-4 h-4"/> {t.paySecurely} ${total}</>}
                  </button>
                  <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3"/>256-bit SSL · Card details never stored
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Nav */}
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-100">
            <button onClick={()=>setStep((s)=>Math.max(1,s-1) as Step)} disabled={step===1||paying||paypalLoading}
              className="flex items-center gap-1 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-sm font-medium hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4"/> {t.back}
            </button>
            {step<5 && (
              <button
                onClick={step===3 ? handleNextFromStep3 : ()=>setStep((s)=>(s+1) as Step)}
                disabled={!canNext()}
                className="flex items-center gap-1 px-6 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-bold hover:bg-brand-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                {step===4 ? t.proceedPayment : t.next} <ChevronRight className="w-4 h-4"/>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
