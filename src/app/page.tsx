"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import { SERVICES } from "@/types/app/booking";
import { Star, ChevronRight, ShieldCheck, Clock, Headphones, Truck } from "lucide-react";

const RATING_MAP: Record<string, { stars: number; count: number }> = {
  "split-1":       { stars: 4.9, count: 2341 },
  "split-multi":   { stars: 4.8, count: 1872 },
  "cassette":      { stars: 4.7, count: 943  },
  "central":       { stars: 4.9, count: 612  },
  "deep-clean":    { stars: 4.8, count: 1504 },
  "chemical-wash": { stars: 4.7, count: 1123 },
};

const BG_MAP: Record<string, string> = {
  "split-1":       "from-sky-400 to-blue-500",
  "split-multi":   "from-blue-400 to-indigo-500",
  "cassette":      "from-teal-400 to-cyan-500",
  "central":       "from-violet-400 to-purple-500",
  "deep-clean":    "from-green-400 to-emerald-500",
  "chemical-wash": "from-orange-400 to-red-400",
};

const BADGES = [
  { icon: ShieldCheck, text: "Certified Technicians" },
  { icon: Clock,       text: "On-Time Guarantee" },
  { icon: Truck,       text: "Come to Your Door" },
  { icon: Headphones,  text: "24/7 Support" },
];

const PROMOS = [
  { label: "New Customer",    desc: "10% OFF first booking",   color: "bg-red-500" },
  { label: "Multi-Unit Deal", desc: "Buy 2 units get 1 free",  color: "bg-brand-600" },
  { label: "Weekend Special", desc: "Free filter check add-on", color: "bg-green-600" },
];

function StarRow({ stars, count }: { stars: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1,2,3,4,5].map((i) => (
          <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(stars) ? "fill-yellow-400 text-yellow-400" : "text-slate-200 fill-slate-200"}`} />
        ))}
      </div>
      <span className="text-xs text-slate-500">({count.toLocaleString()})</span>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      {/* Hero banner — Thai Watsadu style orange promo banner */}
      <section className="bg-gradient-to-r from-brand-700 via-brand-600 to-orange-400 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-widest">
              🔥 Flash Sale — Up to 20% Off
            </div>
            <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-3">
              AC Cleaning &amp; Maintenance<br />
              <span className="text-orange-200">By Certified Experts</span>
            </h1>
            <p className="text-orange-100 mb-5 text-sm leading-relaxed max-w-md">
              Same-day booking available. Professional technicians, guaranteed results,
              transparent pricing — no hidden fees.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/book"
                className="bg-white text-brand-600 font-black px-7 py-3 rounded-xl hover:bg-orange-50 transition-colors shadow-lg text-base">
                Book Now
              </Link>
              <Link href="/register"
                className="bg-white/15 border border-white/40 text-white font-semibold px-7 py-3 rounded-xl hover:bg-white/25 transition-colors text-base">
                Free Account →
              </Link>
            </div>
          </div>
          {/* Promo cards */}
          <div className="flex flex-col gap-3 min-w-[220px]">
            {PROMOS.map((p) => (
              <Link href="/book" key={p.label}
                className={`${p.color} text-white rounded-xl px-4 py-3 flex items-center justify-between hover:opacity-90 transition-opacity`}>
                <div>
                  <p className="font-bold text-sm">{p.label}</p>
                  <p className="text-xs text-white/80">{p.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-center sm:justify-between gap-4">
          {BADGES.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm text-slate-600">
              <Icon className="w-4 h-4 text-brand-600" />
              <span className="font-medium">{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 mb-4 flex items-center gap-1">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span>Home Services</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-800 font-medium">AC Cleaning</span>
        </nav>

        <div className="flex gap-6">
          {/* Sidebar filter */}
          <aside className="hidden lg:block w-52 shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 p-4 sticky top-32">
              <h3 className="font-bold text-slate-800 mb-3 text-sm">Filter Services</h3>

              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">AC Type</p>
                {["Split AC", "Cassette AC", "Central AC", "All Types"].map((t) => (
                  <label key={t} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input type="radio" name="type" className="accent-brand-600" defaultChecked={t === "All Types"} />
                    <span className="text-sm text-slate-700">{t}</span>
                  </label>
                ))}
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Price Range</p>
                {["Under $40", "$40–$70", "$70–$100", "Over $100"].map((r) => (
                  <label key={r} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input type="checkbox" className="accent-brand-600" />
                    <span className="text-sm text-slate-700">{r}</span>
                  </label>
                ))}
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Rating</p>
                {["4.5+", "4.0+", "3.5+"].map((r) => (
                  <label key={r} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input type="radio" name="rating" className="accent-brand-600" />
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-slate-700">{r}</span>
                    </div>
                  </label>
                ))}
              </div>

              <Link href="/book"
                className="mt-5 block w-full text-center bg-brand-600 text-white font-bold py-2.5 rounded-xl hover:bg-brand-700 transition-colors text-sm">
                Apply Filters
              </Link>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm text-slate-600">
                <span className="font-bold text-slate-800">{SERVICES.length}</span> services found
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500 hidden sm:inline">Sort by:</span>
                <select className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                  <option>Popularity</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating</option>
                </select>
              </div>
            </div>

            {/* Service grid — product card style */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SERVICES.map((s) => {
                const r = RATING_MAP[s.id];
                return (
                  <div key={s.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-brand-300 transition-all group flex flex-col">
                    {/* Card image area */}
                    <div className={`bg-gradient-to-br ${BG_MAP[s.id]} h-36 flex flex-col items-center justify-center relative`}>
                      <span className="text-5xl drop-shadow-md">{s.icon}</span>
                      <span className="text-white/90 text-xs font-semibold mt-2 tracking-wide">{s.duration}</span>
                      {/* Sale badge */}
                      {s.id === "split-multi" && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          BEST DEAL
                        </span>
                      )}
                      {s.id === "split-1" && (
                        <span className="absolute top-2 left-2 bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          POPULAR
                        </span>
                      )}
                    </div>

                    {/* Card body */}
                    <div className="p-4 flex flex-col flex-1">
                      <p className="font-bold text-slate-800 text-sm leading-tight mb-1">{s.name}</p>
                      <p className="text-xs text-slate-500 mb-2 line-clamp-2">{s.desc}</p>

                      <StarRow stars={r.stars} count={r.count} />

                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-end justify-between">
                        <div>
                          <p className="text-xs text-slate-400 line-through">${Math.round(s.price * 1.15)}{s.priceUnit}</p>
                          <p className="text-xl font-black text-brand-600">${s.price}<span className="text-xs font-normal text-slate-400">{s.priceUnit}</span></p>
                        </div>
                        <Link href="/book"
                          className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom CTA */}
            <div className="mt-6 bg-gradient-to-r from-brand-600 to-orange-400 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-black text-lg">Can&apos;t find what you need?</p>
                <p className="text-orange-100 text-sm">Talk to our team — we customize every job.</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <Link href="/book"
                  className="bg-white text-brand-600 font-black px-6 py-2.5 rounded-xl hover:bg-orange-50 transition-colors text-sm">
                  Book a Service
                </Link>
                <Link href="/register"
                  className="bg-white/20 border border-white/40 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-white/30 transition-colors text-sm">
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-400 mt-10 py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-brand-600 text-white rounded-lg w-8 h-8 flex items-center justify-center font-black text-sm">❄</div>
              <span className="text-white font-black">AirCare Pro</span>
            </div>
            <p className="text-xs leading-relaxed">Professional AC cleaning and maintenance you can trust.</p>
          </div>
          {[
            { title: "Services", links: ["Split AC Clean", "Cassette AC", "Central AC", "Chemical Wash"] },
            { title: "Account",  links: ["Sign In", "Register", "My Bookings", "Book Service"] },
            { title: "Support",  links: ["+1 (800) AIRCARE", "hello@aircarpro.com", "Live Chat", "FAQ"] },
          ].map(({ title, links }) => (
            <div key={title}>
              <p className="text-white font-semibold mb-3 text-sm">{title}</p>
              <ul className="space-y-1.5">
                {links.map((l) => (
                  <li key={l}><Link href="/book" className="text-xs hover:text-white transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-700 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} AirCare Pro. All rights reserved. &nbsp;|&nbsp; Secure payments &nbsp;|&nbsp; Available worldwide
        </div>
      </footer>
    </div>
  );
}
