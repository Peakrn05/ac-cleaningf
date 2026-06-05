"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/auth/AuthProvider";
import { useLang } from "@/context/lang/LangProvider";
import { Fan, Menu, X, Search, User, ShoppingBag } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t, lang, setLang } = useLang();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleLogout = () => { logout(); router.push("/"); };

  const navLinks = [
    { href: "/", label: t.home },
    { href: "/book", label: t.bookService },
    ...(user ? [{ href: "/dashboard", label: t.myBookings }] : []),
    ...(user?.role === "admin" ? [{ href: "/admin", label: t.admin }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 shadow-md">
      <div className="bg-brand-600 text-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-3 h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-white text-brand-600 rounded-lg w-9 h-9 flex items-center justify-center">
              <Fan className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <p className="font-black text-white text-base leading-tight">AirCare Pro</p>
              <p className="text-brand-200 text-[10px] leading-tight">AC Cleaning Service</p>
            </div>
          </Link>

          <div className="flex-1 max-w-xl mx-auto hidden sm:flex relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && router.push("/book")}
              placeholder={t.searchPlaceholder}
              className="w-full pl-4 pr-12 py-2.5 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
            <button
              type="button"
              onClick={() => router.push("/book")}
              className="absolute right-0 top-0 bottom-0 px-4 bg-brand-700 hover:bg-brand-800 text-white rounded-r-xl flex items-center transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            <div className="flex rounded-lg border border-white/30 bg-white/15 p-0.5 text-xs font-bold">
              {(["en", "th"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    lang === code ? "bg-white text-brand-700" : "text-white hover:bg-white/15"
                  }`}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>

            {user ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-1 text-sm text-white hover:text-brand-100 px-2 py-1">
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline">{user.name.split(" ")[0]}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden md:block text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  {t.signOut}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-white hover:text-brand-100 transition-colors px-2 hidden sm:block">
                  {t.signIn}
                </Link>
                <Link href="/register" className="text-sm bg-white text-brand-600 font-bold px-4 py-1.5 rounded-lg hover:bg-brand-50 transition-colors">
                  {t.register}
                </Link>
              </>
            )}
            <Link href="/book" className="text-white" aria-label={t.bookService}>
              <ShoppingBag className="w-5 h-5" />
            </Link>
            <button type="button" onClick={() => setOpen(!open)} className="sm:hidden p-1.5 rounded-lg hover:bg-white/20" aria-label="Open menu">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto scrollbar-hide">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`shrink-0 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                pathname === l.href
                  ? "border-brand-600 text-brand-600"
                  : "border-transparent text-slate-600 hover:text-brand-600 hover:border-brand-300"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {open && (
        <div className="sm:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-3 animate-fade-in">
          <div className="relative">
            <input
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
          <div className="flex gap-2">
            {!user && (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="flex-1 text-center py-2 text-sm border border-slate-300 rounded-lg text-slate-600">{t.signIn}</Link>
                <Link href="/register" onClick={() => setOpen(false)} className="flex-1 text-center py-2 text-sm bg-brand-600 text-white rounded-lg">{t.register}</Link>
              </>
            )}
            {user && (
              <button type="button" onClick={() => { handleLogout(); setOpen(false); }} className="w-full text-sm text-red-500 border border-red-200 py-2 rounded-lg">
                {t.signOut}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
