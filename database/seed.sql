-- AirCare Pro seed data
-- Run after database/schema.sql.

begin;

insert into users (id, name, email, password_hash, role, phone, created_at)
values
  ('admin-001', 'Admin', 'admin@acclean.com', 'admin123', 'admin', null, '2024-01-01T00:00:00Z'),
  ('user-001', 'Jane Carter', 'jane@example.com', 'password123', 'user', '+1 555 010 1100', '2026-05-20T09:00:00Z'),
  ('user-002', 'Somchai Jaidee', 'somchai@example.com', 'password123', 'user', '+66 81 234 5678', '2026-05-24T10:30:00Z')
on conflict (id) do update set
  name = excluded.name,
  email = excluded.email,
  password_hash = excluded.password_hash,
  role = excluded.role,
  phone = excluded.phone,
  updated_at = now();

insert into countries (code, name, dial_code, sort_order)
values
  ('TH', 'Thailand', '+66', 1),
  ('US', 'United States', '+1', 2),
  ('GB', 'United Kingdom', '+44', 3),
  ('AU', 'Australia', '+61', 4),
  ('SG', 'Singapore', '+65', 5),
  ('MY', 'Malaysia', '+60', 6),
  ('JP', 'Japan', '+81', 7),
  ('CN', 'China', '+86', 8),
  ('KR', 'South Korea', '+82', 9),
  ('IN', 'India', '+91', 10),
  ('DE', 'Germany', '+49', 11),
  ('FR', 'France', '+33', 12),
  ('CA', 'Canada', '+1', 13),
  ('AE', 'UAE', '+971', 14),
  ('SA', 'Saudi Arabia', '+966', 15),
  ('PH', 'Philippines', '+63', 16),
  ('ID', 'Indonesia', '+62', 17),
  ('VN', 'Vietnam', '+84', 18),
  ('BR', 'Brazil', '+55', 19),
  ('NZ', 'New Zealand', '+64', 20)
on conflict (code) do update set
  name = excluded.name,
  dial_code = excluded.dial_code,
  sort_order = excluded.sort_order;

insert into services (id, name, icon_key, price, price_unit, duration, description, card_gradient, sort_order)
values
  ('split-1', 'Split AC - 1 Unit', 'snowflake', 35.00, '/unit', '1-2 hrs', 'Standard cleaning for a single wall-mount split AC.', 'from-sky-400 to-blue-500', 1),
  ('split-multi', 'Split AC - Multi Unit', 'wind', 30.00, '/unit', '2-4 hrs', 'Discounted per-unit rate for 2 or more split units.', 'from-blue-400 to-indigo-500', 2),
  ('cassette', 'Cassette AC', 'square', 55.00, '/unit', '2-3 hrs', 'Ceiling cassette type servicing and deep filter clean.', 'from-teal-400 to-cyan-500', 3),
  ('central', 'Central AC System', 'building', 120.00, '/visit', '4-6 hrs', 'Full ducted system inspection and sanitisation.', 'from-violet-400 to-purple-500', 4),
  ('deep-clean', 'Deep Clean', 'broom', 65.00, '/unit', '3-4 hrs', 'Chemical-free deep clean with antibacterial treatment.', 'from-green-400 to-emerald-500', 5),
  ('chemical-wash', 'Chemical Wash', 'flask', 80.00, '/unit', '3-5 hrs', 'Heavy-duty chemical wash for heavily soiled units.', 'from-orange-400 to-red-400', 6)
on conflict (id) do update set
  name = excluded.name,
  icon_key = excluded.icon_key,
  price = excluded.price,
  price_unit = excluded.price_unit,
  duration = excluded.duration,
  description = excluded.description,
  card_gradient = excluded.card_gradient,
  sort_order = excluded.sort_order,
  updated_at = now();

insert into service_ratings (service_id, stars, review_count)
values
  ('split-1', 4.9, 2341),
  ('split-multi', 4.8, 1872),
  ('cassette', 4.7, 943),
  ('central', 4.9, 612),
  ('deep-clean', 4.8, 1504),
  ('chemical-wash', 4.7, 1123)
on conflict (service_id) do update set
  stars = excluded.stars,
  review_count = excluded.review_count,
  updated_at = now();

insert into service_badges (service_id, label, color_class)
values
  ('split-1', 'POPULAR', 'bg-brand-600'),
  ('split-multi', 'BEST DEAL', 'bg-red-500')
on conflict (service_id) do update set
  label = excluded.label,
  color_class = excluded.color_class;

insert into time_slots (slot, label, sort_order)
values
  ('08:00:00', '08:00', 1),
  ('09:00:00', '09:00', 2),
  ('10:00:00', '10:00', 3),
  ('11:00:00', '11:00', 4),
  ('13:00:00', '13:00', 5),
  ('14:00:00', '14:00', 6),
  ('15:00:00', '15:00', 7),
  ('16:00:00', '16:00', 8)
on conflict (slot) do update set
  label = excluded.label,
  sort_order = excluded.sort_order,
  is_active = true;

insert into booking_status_options (status, label, color_class, sort_order)
values
  ('pending', 'Pending', 'bg-yellow-100 text-yellow-800', 1),
  ('confirmed', 'Confirmed', 'bg-blue-100 text-blue-800', 2),
  ('in-progress', 'In Progress', 'bg-purple-100 text-purple-800', 3),
  ('completed', 'Completed', 'bg-green-100 text-green-800', 4),
  ('cancelled', 'Cancelled', 'bg-red-100 text-red-800', 5)
on conflict (status) do update set
  label = excluded.label,
  color_class = excluded.color_class,
  sort_order = excluded.sort_order;

insert into promotions (id, label, description, color_class, href, sort_order)
values
  ('new-customer', 'New Customer', '10% OFF first booking', 'bg-red-500', '/book', 1),
  ('multi-unit-deal', 'Multi-Unit Deal', 'Buy 2 units get 1 free', 'bg-brand-600', '/book', 2),
  ('weekend-special', 'Weekend Special', 'Free filter check add-on', 'bg-green-600', '/book', 3)
on conflict (id) do update set
  label = excluded.label,
  description = excluded.description,
  color_class = excluded.color_class,
  href = excluded.href,
  sort_order = excluded.sort_order,
  is_active = true;

insert into trust_badges (id, lucide_icon, text, sort_order)
values
  ('certified-technicians', 'ShieldCheck', 'Certified Technicians', 1),
  ('on-time-guarantee', 'Clock', 'On-Time Guarantee', 2),
  ('come-to-your-door', 'Truck', 'Come to Your Door', 3),
  ('support-247', 'Headphones', '24/7 Support', 4)
on conflict (id) do update set
  lucide_icon = excluded.lucide_icon,
  text = excluded.text,
  sort_order = excluded.sort_order,
  is_active = true;

insert into bookings (
  id, user_id, customer_name, customer_email, customer_phone, service_id, units,
  scheduled_date, time_slot, address, notes, status, total_amount, created_at
)
values
  (
    'book-001', 'user-001', 'Jane Carter', 'jane@example.com', '+1 555 010 1100',
    'split-1', 1, '2026-06-05', '08:00:00',
    '12 Maple Street, Unit 4B, Bangkok', 'Please call on arrival.',
    'confirmed', 35.00, '2026-06-04T03:15:00Z'
  ),
  (
    'book-002', 'user-002', 'Somchai Jaidee', 'somchai@example.com', '+66 81 234 5678',
    'split-multi', 3, '2026-06-05', '10:00:00',
    '88 Sukhumvit Road, Floor 12, Bangkok', 'Three wall units in bedrooms.',
    'in-progress', 90.00, '2026-06-04T04:40:00Z'
  ),
  (
    'book-003', null, 'Guest Customer', 'guest@example.com', '+66 89 000 1234',
    'cassette', 1, '2026-06-06', '13:00:00',
    '77 Silom Road, Lobby Area, Bangkok', '',
    'pending', 55.00, '2026-06-04T05:10:00Z'
  ),
  (
    'book-004', 'user-001', 'Jane Carter', 'jane@example.com', '+1 555 010 1100',
    'chemical-wash', 2, '2026-05-28', '15:00:00',
    '12 Maple Street, Unit 4B, Bangkok', 'Heavy dust on balcony unit.',
    'completed', 160.00, '2026-05-25T08:30:00Z'
  ),
  (
    'book-005', 'user-002', 'Somchai Jaidee', 'somchai@example.com', '+66 81 234 5678',
    'central', 1, '2026-05-30', '09:00:00',
    '88 Sukhumvit Road, Floor 12, Bangkok', '',
    'cancelled', 120.00, '2026-05-27T11:20:00Z'
  ),
  (
    'book-006', null, 'Nina Wong', 'nina@example.com', '+65 9000 1122',
    'deep-clean', 2, '2026-06-08', '14:00:00',
    '25 Orchard Link, Singapore', 'Mild odor from one unit.',
    'confirmed', 130.00, '2026-06-04T07:25:00Z'
  )
on conflict (id) do update set
  user_id = excluded.user_id,
  customer_name = excluded.customer_name,
  customer_email = excluded.customer_email,
  customer_phone = excluded.customer_phone,
  service_id = excluded.service_id,
  units = excluded.units,
  scheduled_date = excluded.scheduled_date,
  time_slot = excluded.time_slot,
  address = excluded.address,
  notes = excluded.notes,
  status = excluded.status,
  total_amount = excluded.total_amount,
  updated_at = now();

insert into payments (id, booking_id, method, status, amount, currency, provider_reference, paid_at, created_at)
values
  ('pay-001', 'book-001', 'credit', 'paid', 35.00, 'USD', 'mock-credit-001', '2026-06-04T03:16:00Z', '2026-06-04T03:16:00Z'),
  ('pay-002', 'book-002', 'debit', 'paid', 90.00, 'USD', 'mock-debit-002', '2026-06-04T04:41:00Z', '2026-06-04T04:41:00Z'),
  ('pay-003', 'book-003', 'paypal', 'pending', 55.00, 'USD', 'mock-paypal-003', null, '2026-06-04T05:11:00Z'),
  ('pay-004', 'book-004', 'credit', 'paid', 160.00, 'USD', 'mock-credit-004', '2026-05-25T08:31:00Z', '2026-05-25T08:31:00Z'),
  ('pay-005', 'book-005', 'paypal', 'refunded', 120.00, 'USD', 'mock-paypal-005', '2026-05-27T11:21:00Z', '2026-05-27T11:21:00Z'),
  ('pay-006', 'book-006', 'credit', 'paid', 130.00, 'USD', 'mock-credit-006', '2026-06-04T07:26:00Z', '2026-06-04T07:26:00Z')
on conflict (id) do update set
  booking_id = excluded.booking_id,
  method = excluded.method,
  status = excluded.status,
  amount = excluded.amount,
  currency = excluded.currency,
  provider_reference = excluded.provider_reference,
  paid_at = excluded.paid_at;

commit;
