"use client";

import { FormEvent, useState } from "react";

type BookingSearchResult = {
  id: string;
  status: "pending" | "confirmed" | "expired";
  storeName: string;
  storeAddress: string;
  storeGoogleMapsUrl: string;
  bookingDate: string;
  bookingTime: string;
  vehicleType: string;
  createdAt: string;
};

export default function BookingSearchPage() {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [results, setResults] = useState<BookingSearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const searchBookings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/bookings/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          phoneNumber,
        }),
      });

      const payload = (await response.json()) as
        | { bookings: BookingSearchResult[] }
        | { error: string };

      if (!response.ok || "error" in payload) {
        throw new Error(
          "error" in payload ? payload.error : "Failed to search bookings."
        );
      }

      setResults(payload.bookings);
      setHasSearched(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
      setResults([]);
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 sm:px-8">
      <main className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold">Find Your Booking</h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Enter the same email and phone number used for the booking.
        </p>

        <form
          onSubmit={searchBookings}
          className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-2 block font-medium">Email</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                required
                className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none ring-blue-400 transition focus:ring-2"
                placeholder="you@example.com"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-2 block font-medium">Phone Number</span>
              <input
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                type="tel"
                required
                className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none ring-blue-400 transition focus:ring-2"
                placeholder="+94 77 123 4567"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 h-11 rounded-xl bg-blue-700 px-6 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Searching..." : "Search Bookings"}
          </button>
        </form>

        {errorMessage ? (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        {hasSearched && !errorMessage && results.length === 0 ? (
          <p className="mt-4 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
            No bookings found for that email and phone number.
          </p>
        ) : null}

        {results.length > 0 ? (
          <section className="mt-6 space-y-3">
            {results.map((booking) => (
              <article
                key={booking.id}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">{booking.storeName}</h2>
                    <p className="text-sm text-slate-600">{booking.storeAddress}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 uppercase">
                    {booking.status}
                  </span>
                </div>

                <div className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                  <p>
                    <span className="font-semibold">Date:</span> {booking.bookingDate}
                  </p>
                  <p>
                    <span className="font-semibold">Time:</span> {booking.bookingTime}
                  </p>
                  <p>
                    <span className="font-semibold">Vehicle:</span> {booking.vehicleType}
                  </p>
                  <p>
                    <span className="font-semibold">Booked At:</span>{" "}
                    {new Date(booking.createdAt).toLocaleString()}
                  </p>
                </div>

                <a
                  href={booking.storeGoogleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex h-9 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-500"
                >
                  Open Google Map
                </a>
              </article>
            ))}
          </section>
        ) : null}
      </main>
    </div>
  );
}
