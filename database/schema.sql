-- AirCare Pro database schema
-- Source: mock data and localStorage models under src/
-- Target: PostgreSQL 14+

create extension if not exists pgcrypto;

do $$ begin
  create type user_role as enum ('user', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type booking_status as enum ('pending', 'confirmed', 'in-progress', 'completed', 'cancelled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type payment_method as enum ('paypal', 'credit', 'debit');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type payment_status as enum ('pending', 'paid', 'failed', 'refunded');
exception when duplicate_object then null;
end $$;

create table if not exists users (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  email text not null unique,
  password_hash text not null,
  role user_role not null default 'user',
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists countries (
  code char(2) primary key,
  name text not null,
  dial_code text not null,
  sort_order integer not null,
  created_at timestamptz not null default now()
);

create table if not exists services (
  id text primary key,
  name text not null,
  icon_key text not null,
  price numeric(10,2) not null check (price >= 0),
  price_unit text not null,
  duration text not null,
  description text not null,
  card_gradient text,
  sort_order integer not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists service_ratings (
  service_id text primary key references services(id) on delete cascade,
  stars numeric(2,1) not null check (stars >= 0 and stars <= 5),
  review_count integer not null check (review_count >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists service_badges (
  service_id text primary key references services(id) on delete cascade,
  label text not null,
  color_class text not null
);

create table if not exists time_slots (
  slot time primary key,
  label text not null,
  sort_order integer not null,
  is_active boolean not null default true
);

create table if not exists booking_status_options (
  status booking_status primary key,
  label text not null,
  color_class text not null,
  sort_order integer not null
);

create table if not exists promotions (
  id text primary key,
  label text not null,
  description text not null,
  color_class text not null,
  href text not null default '/book',
  sort_order integer not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists trust_badges (
  id text primary key,
  lucide_icon text not null,
  text text not null,
  sort_order integer not null,
  is_active boolean not null default true
);

create table if not exists bookings (
  id text primary key default gen_random_uuid()::text,
  user_id text references users(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  service_id text not null references services(id),
  units integer not null check (units between 1 and 10),
  scheduled_date date not null,
  time_slot time not null references time_slots(slot),
  address text not null,
  notes text not null default '',
  status booking_status not null default 'pending',
  total_amount numeric(10,2) not null check (total_amount >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists payments (
  id text primary key default gen_random_uuid()::text,
  booking_id text not null unique references bookings(id) on delete cascade,
  method payment_method not null,
  status payment_status not null default 'pending',
  amount numeric(10,2) not null check (amount >= 0),
  currency char(3) not null default 'USD',
  provider_reference text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_users_email on users(email);
create index if not exists idx_bookings_user_id on bookings(user_id);
create index if not exists idx_bookings_status on bookings(status);
create index if not exists idx_bookings_scheduled_date on bookings(scheduled_date);
create index if not exists idx_bookings_service_id on bookings(service_id);
create index if not exists idx_payments_booking_id on payments(booking_id);
