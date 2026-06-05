"use client";
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { User, SafeUser, LoginForm, RegisterForm } from "@/types/app/auth";

interface AuthCtx {
  user: SafeUser | null;
  isLoading: boolean;
  login: (f: LoginForm) => Promise<string | null>;
  register: (f: RegisterForm) => Promise<string | null>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const USERS_KEY = "ac-users";
const SESSION_KEY = "ac-session";

const ADMIN: User = {
  id: "admin-001", name: "Admin", email: "admin@acclean.com",
  password: "admin123", role: "admin", createdAt: "2024-01-01T00:00:00Z",
};

function getUsers(): User[] {
  try {
    const list: User[] = JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
    if (!list.find((u) => u.id === ADMIN.id)) list.unshift(ADMIN);
    return list;
  } catch { return [ADMIN]; }
}

function toSafe({ password: _p, ...u }: User): SafeUser { return u; }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try { const raw = localStorage.getItem(SESSION_KEY); if (raw) setUser(JSON.parse(raw)); } catch {}
    setIsLoading(false);
  }, []);

  const persist = (u: SafeUser) => { setUser(u); localStorage.setItem(SESSION_KEY, JSON.stringify(u)); };

  const login = useCallback(async (f: LoginForm): Promise<string | null> => {
    const found = getUsers().find((u) => u.email === f.email && u.password === f.password);
    if (!found) return "Invalid email or password.";
    persist(toSafe(found)); return null;
  }, []);

  const register = useCallback(async (f: RegisterForm): Promise<string | null> => {
    const users = getUsers();
    if (users.find((u) => u.email === f.email)) return "Email already registered.";
    const nu: User = { id: crypto.randomUUID(), name: f.name, email: f.email, password: f.password, phone: f.phone, role: "user", createdAt: new Date().toISOString() };
    users.push(nu);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    persist(toSafe(nu)); return null;
  }, []);

  const logout = useCallback(() => { setUser(null); localStorage.removeItem(SESSION_KEY); }, []);

  return <Ctx.Provider value={{ user, isLoading, login, register, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth outside AuthProvider");
  return ctx;
};
