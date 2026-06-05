export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  createdAt: string;
}

export type SafeUser = Omit<User, "password">;
export interface LoginForm { email: string; password: string; }
export interface RegisterForm { name: string; email: string; password: string; phone?: string; }
