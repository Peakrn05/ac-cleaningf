"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface Country { flag: string; name: string; dial: string; code: string; }

export const COUNTRIES: Country[] = [
  { flag: "TH", name: "Thailand",         dial: "+66", code: "TH" },
  { flag: "US", name: "United States",    dial: "+1",  code: "US" },
  { flag: "GB", name: "United Kingdom",   dial: "+44", code: "GB" },
  { flag: "AU", name: "Australia",        dial: "+61", code: "AU" },
  { flag: "SG", name: "Singapore",        dial: "+65", code: "SG" },
  { flag: "MY", name: "Malaysia",         dial: "+60", code: "MY" },
  { flag: "JP", name: "Japan",            dial: "+81", code: "JP" },
  { flag: "CN", name: "China",            dial: "+86", code: "CN" },
  { flag: "KR", name: "South Korea",      dial: "+82", code: "KR" },
  { flag: "IN", name: "India",            dial: "+91", code: "IN" },
  { flag: "DE", name: "Germany",          dial: "+49", code: "DE" },
  { flag: "FR", name: "France",           dial: "+33", code: "FR" },
  { flag: "CA", name: "Canada",           dial: "+1",  code: "CA" },
  { flag: "AE", name: "UAE",              dial: "+971",code: "AE" },
  { flag: "SA", name: "Saudi Arabia",     dial: "+966",code: "SA" },
  { flag: "PH", name: "Philippines",      dial: "+63", code: "PH" },
  { flag: "ID", name: "Indonesia",        dial: "+62", code: "ID" },
  { flag: "VN", name: "Vietnam",          dial: "+84", code: "VN" },
  { flag: "BR", name: "Brazil",           dial: "+55", code: "BR" },
  { flag: "NZ", name: "New Zealand",      dial: "+64", code: "NZ" },
];

interface Props {
  value: string;
  onChange: (fullNumber: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export default function PhoneInput({ value, onChange, placeholder = "000 000 0000", label, className = "" }: Props) {
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [number, setNumber]   = useState("");
  const [open, setOpen]       = useState(false);
  const [search, setSearch]   = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // Extract dial prefix from stored value on mount
  useEffect(() => {
    if (value) {
      const found = COUNTRIES.find((c) => value.startsWith(c.dial));
      if (found) {
        setCountry(found);
        setNumber(value.slice(found.dial.length).trim());
      } else {
        setNumber(value);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onChange(number ? `${country.dial} ${number}` : "");
  }, [country, number, onChange]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = COUNTRIES.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.dial.includes(search)
  );

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
      <div className="flex gap-0 relative" ref={ref}>
        {/* Country selector */}
        <button type="button" onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 px-3 py-3 bg-slate-50 border border-r-0 border-slate-300 rounded-l-xl text-sm hover:bg-slate-100 transition-colors whitespace-nowrap">
          <span className="text-[11px] font-bold leading-none text-slate-500">{country.flag}</span>
          <span className="text-slate-600 font-mono text-xs">{country.dial}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {/* Number input */}
        <input
          type="tel" inputMode="numeric" value={number}
          onChange={(e) => setNumber(e.target.value.replace(/[^\d\s\-()]/g, ""))}
          placeholder={placeholder}
          className="flex-1 border border-slate-300 rounded-r-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent min-w-0"
        />

        {/* Dropdown */}
        {open && (
          <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-xl w-64 animate-fade-in overflow-hidden">
            <div className="p-2 border-b border-slate-100">
              <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="overflow-y-auto max-h-52">
              {filtered.map((c) => (
                <button key={c.code} type="button"
                  onClick={() => { setCountry(c); setOpen(false); setSearch(""); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-brand-50 transition-colors ${
                    country.code === c.code ? "bg-brand-50 text-brand-700 font-semibold" : "text-slate-700"
                  }`}>
                  <span className="w-6 text-[11px] font-bold text-slate-500">{c.flag}</span>
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="text-slate-400 font-mono text-xs shrink-0">{c.dial}</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-center text-slate-400 text-sm py-4">No results</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
