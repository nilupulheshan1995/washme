import { createHash, randomBytes, randomUUID } from "node:crypto";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export type CreatePendingBookingInput = {
  storeSlug: string;
  storeName: string;
  storeAddress: string;
  storeMainImageUrl: string;
  storeGoogleMapsUrl: string;
  customerName: string;
  email: string;
  phoneNumber: string;
  vehicleType: string;
  bookingDate: string;
  bookingTime: string;
};

export type BookingRecord = {
  id: string;
  status: "pending" | "confirmed" | "expired";
  createdAt: string;
  verifiedAt: string | null;
  verificationTokenHash: string;
  verificationExpiresAt: string;
  emailDeliveryStatus: "queued" | "sent" | "failed";
  emailSentAt: string | null;
  emailProvider: string | null;
  emailProviderMessageId: string | null;
  storeSlug: string;
  storeName: string;
  storeAddress: string;
  storeMainImageUrl: string;
  storeGoogleMapsUrl: string;
  bookingDate: string;
  bookingTime: string;
  vehicleType: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
};

type BookingRow = {
  id: string;
  status: "pending" | "confirmed" | "expired";
  created_at: string;
  verified_at: string | null;
  verification_token_hash: string;
  verification_expires_at: string;
  email_delivery_status: "queued" | "sent" | "failed";
  email_sent_at: string | null;
  email_provider: string | null;
  email_provider_message_id: string | null;
  store_slug: string;
  store_name: string;
  store_address: string;
  store_main_image_url: string;
  store_google_maps_url: string;
  booking_date: string;
  booking_time: string;
  vehicle_type: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
};

declare global {
  var __washmeDraftBookings: Map<string, BookingRecord> | undefined;
  var __washmeBookingTokenIndex: Map<string, string> | undefined;
}

const localBookings =
  global.__washmeDraftBookings ?? new Map<string, BookingRecord>();
const localTokenIndex = global.__washmeBookingTokenIndex ?? new Map<string, string>();
global.__washmeDraftBookings = localBookings;
global.__washmeBookingTokenIndex = localTokenIndex;

const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

const createVerificationToken = () =>
  `${randomUUID()}-${randomBytes(16).toString("hex")}`;

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const normalizePhone = (phone: string) =>
  phone
    .trim()
    .replace(/\s+/g, "")
    .replace(/[^+\d]/g, "");

const rowToRecord = (row: BookingRow): BookingRecord => ({
  id: row.id,
  status: row.status,
  createdAt: row.created_at,
  verifiedAt: row.verified_at,
  verificationTokenHash: row.verification_token_hash,
  verificationExpiresAt: row.verification_expires_at,
  emailDeliveryStatus: row.email_delivery_status,
  emailSentAt: row.email_sent_at,
  emailProvider: row.email_provider,
  emailProviderMessageId: row.email_provider_message_id,
  storeSlug: row.store_slug,
  storeName: row.store_name,
  storeAddress: row.store_address,
  storeMainImageUrl: row.store_main_image_url,
  storeGoogleMapsUrl: row.store_google_maps_url,
  bookingDate: row.booking_date,
  bookingTime: row.booking_time,
  vehicleType: row.vehicle_type,
  customerName: row.customer_name,
  customerEmail: row.customer_email,
  customerPhone: row.customer_phone,
});

export const createPendingBooking = async (input: CreatePendingBookingInput) => {
  const verificationToken = createVerificationToken();
  const verificationTokenHash = hashToken(verificationToken);
  const bookingId = randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30).toISOString();
  const normalizedEmail = normalizeEmail(input.email);
  const normalizedPhone = normalizePhone(input.phoneNumber);

  const client = getSupabaseAdminClient();
  if (!client) {
    const localBooking: BookingRecord = {
      id: bookingId,
      status: "pending",
      createdAt: new Date().toISOString(),
      verifiedAt: null,
      verificationTokenHash,
      verificationExpiresAt: expiresAt,
      emailDeliveryStatus: "queued",
      emailSentAt: null,
      emailProvider: null,
      emailProviderMessageId: null,
      storeSlug: input.storeSlug,
      storeName: input.storeName,
      storeAddress: input.storeAddress,
      storeMainImageUrl: input.storeMainImageUrl,
      storeGoogleMapsUrl: input.storeGoogleMapsUrl,
      bookingDate: input.bookingDate,
      bookingTime: input.bookingTime,
      vehicleType: input.vehicleType,
      customerName: input.customerName,
      customerEmail: normalizedEmail,
      customerPhone: normalizedPhone,
    };

    localBookings.set(bookingId, localBooking);
    localTokenIndex.set(verificationTokenHash, bookingId);

    return {
      booking: localBooking,
      verificationToken,
    };
  }

  const { data, error } = await client
    .from("bookings")
    .insert({
      id: bookingId,
      status: "pending",
      verification_token_hash: verificationTokenHash,
      verification_expires_at: expiresAt,
      email_delivery_status: "queued",
      store_slug: input.storeSlug,
      store_name: input.storeName,
      store_address: input.storeAddress,
      store_main_image_url: input.storeMainImageUrl,
      store_google_maps_url: input.storeGoogleMapsUrl,
      booking_date: input.bookingDate,
      booking_time: input.bookingTime,
      vehicle_type: input.vehicleType,
      customer_name: input.customerName,
      customer_email: normalizedEmail,
      customer_phone: normalizedPhone,
    })
    .select("*")
    .single<BookingRow>();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to create booking record.");
  }

  return {
    booking: rowToRecord(data),
    verificationToken,
  };
};

export const markBookingEmailStatus = async (
  bookingId: string,
  status: "sent" | "failed",
  provider?: string,
  providerMessageId?: string
) => {
  const client = getSupabaseAdminClient();

  if (!client) {
    const existing = localBookings.get(bookingId);
    if (!existing) {
      return null;
    }

    existing.emailDeliveryStatus = status;
    existing.emailProvider = provider ?? null;
    existing.emailProviderMessageId = providerMessageId ?? null;
    if (status === "sent") {
      existing.emailSentAt = new Date().toISOString();
    }

    localBookings.set(existing.id, existing);
    return existing;
  }

  const updatePayload: {
    email_delivery_status: "sent" | "failed";
    email_provider: string | null;
    email_provider_message_id: string | null;
    email_sent_at?: string;
  } = {
    email_delivery_status: status,
    email_provider: provider ?? null,
    email_provider_message_id: providerMessageId ?? null,
  };

  if (status === "sent") {
    updatePayload.email_sent_at = new Date().toISOString();
  }

  const { data, error } = await client
    .from("bookings")
    .update(updatePayload)
    .eq("id", bookingId)
    .select("*")
    .single<BookingRow>();

  if (error || !data) {
    return null;
  }

  return rowToRecord(data);
};

export const confirmBookingByToken = async (token: string) => {
  const tokenHash = hashToken(token);
  const client = getSupabaseAdminClient();

  if (!client) {
    const bookingId = localTokenIndex.get(tokenHash);
    const localBooking = bookingId ? localBookings.get(bookingId) : undefined;

    if (!localBooking) {
      return { state: "invalid" as const, booking: null };
    }

    if (localBooking.status === "confirmed") {
      return { state: "already_confirmed" as const, booking: localBooking };
    }

    if (new Date(localBooking.verificationExpiresAt).getTime() < Date.now()) {
      localBooking.status = "expired";
      localBookings.set(localBooking.id, localBooking);
      localTokenIndex.delete(localBooking.verificationTokenHash);
      return { state: "expired" as const, booking: localBooking };
    }

    localBooking.status = "confirmed";
    localBooking.verifiedAt = new Date().toISOString();
    localBookings.set(localBooking.id, localBooking);
    localTokenIndex.delete(localBooking.verificationTokenHash);

    return { state: "confirmed" as const, booking: localBooking };
  }

  const { data, error } = await client
    .from("bookings")
    .select("*")
    .eq("verification_token_hash", tokenHash)
    .limit(1)
    .maybeSingle<BookingRow>();

  if (error || !data) {
    return { state: "invalid" as const, booking: null };
  }

  const booking = rowToRecord(data);

  if (booking.status === "confirmed") {
    return { state: "already_confirmed" as const, booking };
  }

  if (new Date(booking.verificationExpiresAt).getTime() < Date.now()) {
    const { data: expiredData } = await client
      .from("bookings")
      .update({ status: "expired" })
      .eq("id", booking.id)
      .select("*")
      .single<BookingRow>();

    return {
      state: "expired" as const,
      booking: expiredData ? rowToRecord(expiredData) : booking,
    };
  }

  const { data: confirmedData, error: confirmError } = await client
    .from("bookings")
    .update({ status: "confirmed", verified_at: new Date().toISOString() })
    .eq("id", booking.id)
    .select("*")
    .single<BookingRow>();

  if (confirmError || !confirmedData) {
    return { state: "invalid" as const, booking: null };
  }

  return { state: "confirmed" as const, booking: rowToRecord(confirmedData) };
};

export const searchBookingsByCustomer = async (email: string, phone: string) => {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phone);
  const client = getSupabaseAdminClient();

  if (!client) {
    return [...localBookings.values()]
      .filter(
        (booking) =>
          booking.customerEmail === normalizedEmail &&
          booking.customerPhone === normalizedPhone
      )
      .sort((first, second) =>
        second.createdAt.localeCompare(first.createdAt)
      );
  }

  const { data, error } = await client
    .from("bookings")
    .select("*")
    .eq("customer_email", normalizedEmail)
    .eq("customer_phone", normalizedPhone)
    .order("created_at", { ascending: false })
    .returns<BookingRow[]>();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to load customer bookings.");
  }

  return data.map(rowToRecord);
};
