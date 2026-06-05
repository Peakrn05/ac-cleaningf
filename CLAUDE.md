# AirCare Pro — AC Cleaning System

Next.js 15 · TypeScript · TailwindCSS v3 · localStorage state · No backend

## Routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | Guest | Landing page — services, pricing, CTAs |
| `/login` | Guest | Sign in (admin demo: admin@acclean.com / admin123) |
| `/register` | Guest | Create account |
| `/book` | Guest/User | 4-step booking wizard |
| `/dashboard` | Auth required | View & cancel own bookings |
| `/admin` | Admin only | All bookings, status management, today's queue |

## State (localStorage)

| Key | Contents |
|-----|----------|
| `ac-users` | Registered users array |
| `ac-session` | Current user session (SafeUser) |
| `ac-bookings-v1` | All bookings array |

Admin account is auto-seeded: `admin@acclean.com` / `admin123`

## Key files

```
src/
├── context/auth/AuthProvider.tsx     — login, register, logout
├── context/booking/BookingProvider.tsx — add, update, filter bookings
├── types/app/auth/index.ts
├── types/app/booking/index.ts        — SERVICES, TIME_SLOTS, status maps
├── components/common/Navbar.tsx      — sticky nav, mobile menu
└── app/
    ├── page.tsx          — landing
    ├── login/page.tsx
    ├── register/page.tsx
    ├── book/page.tsx     — 4-step wizard
    ├── dashboard/page.tsx
    └── admin/page.tsx    — booking table + today's queue grid
```

## Commands

```bash
npm install
npm run dev   # http://localhost:3000
```

## Services

Split AC, Split Multi-unit, Cassette, Central, Deep Clean, Chemical Wash
Time slots: 08:00–16:00 (hourly, lunch break at 12:00)
