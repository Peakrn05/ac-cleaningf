"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/auth/AuthProvider";
import { Wind, Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); router.push("/"); };

  const links = [
    { href: "/", label: "Home" },
    { href: "/book", label: "Book Now" },
    ...(user ? [{ href: "/dashboard", label: "My Bookings" }] : []),
    ...(user?.role === "admin" ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link href={href} onClick={() => setOpen(false)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        pathname === href ? "bg-brand-50 text-brand-600" : "text-slate-600 hover:text-brand-600 hover:bg-brand-50"
      }`}>
      {label}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 text-brand-600 font-bold text-lg">
          <Wind className="w-6 h-6" /> AirCare Pro
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => <NavLink key={l.href} {...l} />)}
        </div>
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-slate-500">Hi, {user.name.split(" ")[0]}</span>
              <button onClick={handleLogout} className="text-sm px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm px-4 py-2 text-slate-600 hover:text-brand-600 transition-colors">Sign In</Link>
              <Link href="/register" className="text-sm px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">Register</Link>
            </>
          )}
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-slate-100">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 animate-fade-in">
          {links.map((l) => <NavLink key={l.href} {...l} />)}
          <div className="border-t border-slate-100 pt-2 mt-2 flex gap-2">
            {user ? (
              <button onClick={() => { handleLogout(); setOpen(false); }} className="w-full py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50">Sign Out</button>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="flex-1 text-center py-2 text-sm border border-slate-300 rounded-lg text-slate-600">Sign In</Link>
                <Link href="/register" onClick={() => setOpen(false)} className="flex-1 text-center py-2 text-sm bg-brand-600 text-white rounded-lg">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
