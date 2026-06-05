"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth/AuthProvider";
import { useLang, validateEmail } from "@/context/lang/LangProvider";
import { CheckCircle, Eye, EyeOff, Fan, User } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useLang();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [emailErr, setEmailErr] = useState("");
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(form.email)) { setEmailErr(t.invalidEmail); return; }
    setEmailErr(""); setError(""); setLoading(true);
    const err = await login(form);
    setLoading(false);
    if (err) { setError(err); return; }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 text-brand-600 font-bold text-xl mb-8">
          <div className="bg-brand-600 text-white rounded-lg w-9 h-9 flex items-center justify-center">
            <Fan className="w-5 h-5" />
          </div>
          AirCare Pro
        </Link>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-fade-in">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">{t.welcomeBack}</h1>
          <p className="text-slate-500 text-sm mb-6">{t.signInDesc}</p>

          <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-6">
            <p className="text-xs font-semibold text-brand-700 mb-2">Quick Demo:</p>
            <div className="flex gap-2">
              <button type="button" onClick={()=>setForm({email:"admin@acclean.com",password:"admin123"})}
                className="flex-1 py-2 text-xs bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-semibold">Admin</button>
              <button type="button" onClick={()=>setForm({email:"user@example.com",password:"user123"})}
                className="flex-1 py-2 text-xs bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-semibold">Demo User</button>
            </div>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.email}</label>
              <input type="email" required value={form.email}
                onChange={(e)=>{setForm((f)=>({...f,email:e.target.value}));if(emailErr)setEmailErr("");}}
                onBlur={()=>form.email&&!validateEmail(form.email)?setEmailErr(t.invalidEmail):setEmailErr("")}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${emailErr?"border-red-400 bg-red-50":"border-slate-300"}`}
                placeholder={t.emailPlaceholder} />
              {emailErr && <p className="text-red-500 text-xs mt-1">{emailErr}</p>}
              {form.email&&!emailErr&&validateEmail(form.email)&&(
                <p className="text-green-600 text-xs mt-1 flex items-center gap-1"><CheckCircle className="w-3 h-3"/>{t.validEmail}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.password}</label>
              <div className="relative">
                <input type={showPw?"text":"password"} required value={form.password}
                  onChange={(e)=>setForm((f)=>({...f,password:e.target.value}))}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Password" />
                <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPw?<EyeOff className="w-5 h-5"/>:<Eye className="w-5 h-5"/>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50">
              {loading?t.signingIn:t.signIn}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <Link href="/book" className="flex items-center justify-center gap-2 w-full py-3 border-2 border-brand-200 text-brand-600 font-semibold rounded-xl hover:bg-brand-50 transition-colors text-sm mb-3">
              <User className="w-4 h-4" /> {t.continueAsGuest}
            </Link>
            <p className="text-sm text-slate-500">{t.noAccount} <Link href="/register" className="text-brand-600 font-semibold hover:underline">{t.createOneFree}</Link></p>
          </div>
        </div>
        <p className="text-center mt-4 text-sm"><Link href="/" className="text-slate-400 hover:text-brand-600">{t.home}</Link></p>
      </div>
    </div>
  );
}
