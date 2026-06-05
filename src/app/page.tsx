import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import { SERVICES } from "@/types/app/booking";
import { CheckCircle, Clock, Shield, Star, Phone, Mail, MapPin } from "lucide-react";

const HOW_IT_WORKS = [
  { step: "01", title: "Choose Service", desc: "Pick your AC type and the cleaning service needed." },
  { step: "02", title: "Pick a Time Slot", desc: "Choose your preferred date and time from available slots." },
  { step: "03", title: "We Come to You", desc: "A certified technician arrives at your location." },
  { step: "04", title: "Fresh & Clean", desc: "Enjoy better air quality and improved AC performance." },
];

const GUARANTEES = [
  { icon: Shield, label: "Licensed Technicians" },
  { icon: CheckCircle, label: "Satisfaction Guaranteed" },
  { icon: Clock, label: "On-Time Arrival" },
  { icon: Star, label: "5-Star Rated" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm mb-6 animate-fade-in">
            ❄️ Professional AC Maintenance — Available Worldwide
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
            Breathe Cleaner Air.<br />
            <span className="text-sky-200">Book Your AC Service Today.</span>
          </h1>
          <p className="text-lg text-sky-100 mb-8 max-w-2xl mx-auto">
            Expert air conditioner cleaning, chemical wash, and maintenance. Certified technicians, guaranteed results, same-week bookings.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/book" className="bg-white text-brand-700 font-bold px-8 py-4 rounded-xl hover:bg-sky-50 transition-colors text-lg shadow-lg">
              Book a Service →
            </Link>
            <Link href="/register" className="bg-white/10 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors text-lg">
              Create Free Account
            </Link>
          </div>
          <p className="mt-5 text-sm text-sky-200">
            Already registered?{" "}
            <Link href="/login" className="underline hover:text-white font-semibold">Sign in here</Link>
          </p>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-brand-900 py-4">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-6 sm:gap-12">
          {GUARANTEES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-sky-200">
              <Icon className="w-4 h-4 text-sky-400" /> {label}
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800">Our Services</h2>
            <p className="text-slate-500 mt-2">Choose the right service for your AC unit</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s) => (
              <div key={s.id} className="border border-slate-200 rounded-2xl p-6 hover:border-brand-400 hover:shadow-md transition-all">
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-bold text-slate-800 mb-1">{s.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{s.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-brand-600 font-bold text-lg">
                    ${s.price}<span className="text-sm font-normal text-slate-400">{s.priceUnit}</span>
                  </span>
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">⏱ {s.duration}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/book" className="inline-block bg-brand-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-brand-700 transition-colors">
              Book Any Service →
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-brand-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800">How It Works</h2>
            <p className="text-slate-500 mt-2">Book in under 2 minutes</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((h) => (
              <div key={h.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand-600 text-white text-lg font-bold flex items-center justify-center mx-auto mb-3">
                  {h.step}
                </div>
                <h4 className="font-bold text-slate-800 mb-1">{h.title}</h4>
                <p className="text-sm text-slate-500">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 bg-gradient-to-r from-brand-700 to-brand-500 text-white text-center">
        <h2 className="text-3xl font-bold mb-3">Ready for a Fresher AC?</h2>
        <p className="text-sky-100 mb-6">Same-week slots available. No hidden fees.</p>
        <Link href="/book" className="inline-block bg-white text-brand-700 font-bold px-10 py-4 rounded-xl hover:bg-sky-50 transition-colors shadow-lg text-lg">
          Book Now — Free to Reserve
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <h4 className="text-white font-bold mb-2">❄️ AirCare Pro</h4>
            <p className="text-sm">Professional AC cleaning and maintenance you can trust.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm">
              <li><Link href="/book" className="hover:text-white transition-colors">Book Service</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Register</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Contact</h4>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> +1 (800) AIRCARE</div>
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> hello@aircarpro.com</div>
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Available Worldwide</div>
            </div>
          </div>
        </div>
        <div className="text-center mt-8 text-xs text-slate-600 border-t border-slate-800 pt-6">
          © {new Date().getFullYear()} AirCare Pro. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
