"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth/AuthProvider";
import { Wind, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    const err = await login(form);
    setLoading(false);
    if (err) { setError(err); return; }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 text-brand-600 font-bold text-xl mb-8">
          <Wind className="w-7 h-7" /> AirCare Pro
        </Link>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-fade-in">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Welcome back</h1>
          <p className="text-slate-500 text-sm mb-6">Sign in to manage your bookings</p>

          {/* Demo credentials */}
          <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-6">
            <p className="text-xs font-semibold text-brand-700 mb-2">Quick Demo Login:</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setForm({ email: "admin@acclean.com", password: "admin123" })}
                className="flex-1 py-2 text-xs bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-semibold">
                Admin
              </button>
              <button type="button" onClick={() => setForm({ email: "user@example.com", password: "user123" })}
                className="flex-1 py-2 text-xs bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-semibold">
                Demo User
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">Or register a new account below</p>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} required value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="Your password" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            No account?{" "}
            <Link href="/register" className="text-brand-600 font-semibold hover:underline">Create one free →</Link>
          </p>
        </div>
        <p className="text-center mt-4 text-sm"><Link href="/" className="text-slate-400 hover:text-brand-600">← Back to home</Link></p>
      </div>
    </div>
  );
}
