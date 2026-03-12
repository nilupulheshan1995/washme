import Link from "next/link";
import { confirmBookingByToken } from "@/lib/bookings";
import { getStoreBySlug } from "@/lib/stores";

type VerifyPageProps = {
  params: Promise<{ token: string }>;
};

export default async function VerifyPage({ params }: VerifyPageProps) {
  const { token } = await params;
  const verificationResult = await confirmBookingByToken(token);
  const booking = verificationResult.booking;
  const store = booking ? getStoreBySlug(booking.storeSlug) : null;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
      <main className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-[0_24px_60px_-36px_rgba(15,23,42,0.55)] sm:p-10">
        {(verificationResult.state === "confirmed" ||
          verificationResult.state === "already_confirmed") &&
        booking ? (
          <>
            <p className="text-sm font-semibold tracking-[0.14em] text-emerald-700 uppercase">
              {verificationResult.state === "already_confirmed"
                ? "Already Confirmed"
                : "Booking Confirmed"}
            </p>
            <h1 className="mt-3 text-3xl font-semibold">
              {verificationResult.state === "already_confirmed"
                ? "This booking was already confirmed earlier."
                : "Your wash slot has been confirmed."}
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
              {booking.customerName}, your booking for{" "}
              <span className="font-semibold">{booking.vehicleType}</span> at{" "}
              <span className="font-semibold">
                {store ? store.name : booking.storeSlug}
              </span>{" "}
              on <span className="font-semibold">{booking.bookingDate}</span> (
              {booking.bookingTime}) is now active.
            </p>
          </>
        ) : verificationResult.state === "expired" ? (
          <>
            <p className="text-sm font-semibold tracking-[0.14em] text-amber-700 uppercase">
              Link Expired
            </p>
            <h1 className="mt-3 text-3xl font-semibold">
              This verification link has expired.
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
              Please create a new booking to receive a fresh verification email.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold tracking-[0.14em] text-rose-700 uppercase">
              Invalid Link
            </p>
            <h1 className="mt-3 text-3xl font-semibold">
              This verification link is no longer valid.
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
              The booking may have expired or the link was copied incorrectly.
              Please create a new booking from the store page.
            </p>
          </>
        )}

        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-orange-600 px-6 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          Return to Home
        </Link>
      </main>
    </div>
  );
}
