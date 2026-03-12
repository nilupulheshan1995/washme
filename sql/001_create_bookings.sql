create extension if not exists pgcrypto;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  status text not null check (status in ('pending', 'confirmed', 'expired')),
  created_at timestamptz not null default now(),
  verified_at timestamptz,
  verification_token_hash text not null unique,
  verification_expires_at timestamptz not null,
  email_delivery_status text not null default 'queued' check (email_delivery_status in ('queued', 'sent', 'failed')),
  email_sent_at timestamptz,
  email_provider text,
  email_provider_message_id text,
  store_slug text not null,
  store_name text not null,
  store_address text not null,
  store_main_image_url text not null,
  store_google_maps_url text not null,
  booking_date date not null,
  booking_time text not null,
  vehicle_type text not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null
);

create index if not exists idx_bookings_customer_lookup
  on public.bookings (customer_email, customer_phone);

create index if not exists idx_bookings_created_at
  on public.bookings (created_at desc);
