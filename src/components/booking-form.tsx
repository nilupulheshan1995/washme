"use client";

import { FormEvent, useMemo, useState } from "react";
import { type Store } from "@/lib/stores";

type BookingFormProps = {
  store: Store;
};

type DraftBookingResponse = {
  message: string;
  verificationUrl?: string;
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(date.getDate() + days);
  return next;
};

const dateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const readableDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

const toTimeLabel = (hour: number) =>
  `${`${hour}`.padStart(2, "0")}:00 - ${`${hour + 1}`.padStart(2, "0")}:00`;

const pseudoBusy = (seed: string) => {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 100000;
  }
  return hash % 7 === 0;
};

export const BookingForm = ({ store }: BookingFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleType, setVehicleType] = useState("Sedan");
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verificationUrl, setVerificationUrl] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const availableDates = useMemo(() => {
    const today = new Date();

    return Array.from({ length: 14 }, (_, index) => addDays(today, index)).filter(
      (day) => !store.closedWeekdays.includes(day.getDay())
    );
  }, [store.closedWeekdays]);

  const availableSlots = useMemo(() => {
    if (!selectedDateKey) {
      return [];
    }

    const today = new Date();
    const todayKey = dateKey(today);

    const slots: string[] = [];
    for (
      let hour = store.slotWindow.startHour;
      hour < store.slotWindow.endHour;
      hour += 1
    ) {
      if (selectedDateKey === todayKey && hour <= today.getHours()) {
        continue;
      }

      const seed = `${store.slug}-${selectedDateKey}-${hour}`;
      const blocked = pseudoBusy(seed) || (!store.instantBookingEnabled && hour % 2 === 1);
      if (!blocked) {
        slots.push(toTimeLabel(hour));
      }
    }

    return slots;
  }, [selectedDateKey, store]);

  const selectedDateLabel = useMemo(() => {
    if (!selectedDateKey) {
      return null;
    }

    const foundDate = availableDates.find((day) => dateKey(day) === selectedDateKey);
    return foundDate ? readableDate(foundDate) : selectedDateKey;
  }, [availableDates, selectedDateKey]);

  const goToStepTwo = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setVerificationUrl(null);

    if (!selectedDateKey || !selectedTimeSlot) {
      setErrorMessage("Please select an available date and one-hour time slot.");
      return;
    }

    setStep(2);
  };

  const submitDraftBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setVerificationUrl(null);

    if (!selectedDateKey || !selectedTimeSlot) {
      setErrorMessage("Please select booking date and timeslot first.");
      setStep(1);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bookings/draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeSlug: store.slug,
          customerName: name,
          email,
          phoneNumber: phone,
          vehicleType,
          bookingDate: selectedDateKey,
          bookingTime: selectedTimeSlot,
        }),
      });

      const responseData = (await response.json()) as
        | DraftBookingResponse
        | { error: string };

      if (!response.ok || "error" in responseData) {
        throw new Error(
          "error" in responseData
            ? responseData.error
            : "Unable to create draft booking."
        );
      }

      setSuccessMessage(responseData.message);
      setVerificationUrl(responseData.verificationUrl ?? null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.5)]">
      <h2 className="text-2xl font-semibold">Reserve Your Slot</h2>
      <p className="mt-2 text-sm text-slate-600">
        Book at <span className="font-semibold text-slate-900">{store.name}</span> in
        two steps. First pick date/time, then add your contact details.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setStep(1)}
          className={`h-9 rounded-lg transition ${
            step === 1 ? "bg-white text-slate-900" : "text-slate-500"
          }`}
        >
          1. Date & Time
        </button>
        <button
          type="button"
          onClick={() => selectedDateKey && selectedTimeSlot && setStep(2)}
          className={`h-9 rounded-lg transition ${
            step === 2 ? "bg-white text-slate-900" : "text-slate-500"
          }`}
        >
          2. Contact Details
        </button>
      </div>

      {step === 1 ? (
        <div className="mt-5 space-y-4">
          <div>
            <p className="mb-2 text-sm font-semibold">Select Date</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {availableDates.map((day) => {
                const key = dateKey(day);
                const isSelected = key === selectedDateKey;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSelectedDateKey(key);
                      setSelectedTimeSlot(null);
                    }}
                    className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                      isSelected
                        ? "border-orange-500 bg-orange-50 text-orange-900"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {readableDate(day)}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold">Available One-Hour Time Slots</p>
            <div className="grid grid-cols-2 gap-2">
              {availableSlots.length > 0 ? (
                availableSlots.map((slot) => {
                  const isSelected = slot === selectedTimeSlot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`rounded-xl border px-3 py-2 text-sm transition ${
                        isSelected
                          ? "border-orange-500 bg-orange-50 text-orange-900"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })
              ) : (
                <p className="col-span-2 rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-600">
                  Select a date to view available slots.
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={goToStepTwo}
            className="h-11 w-full rounded-xl bg-orange-600 text-sm font-semibold text-white transition hover:bg-orange-700"
          >
            Continue to Contact Details
          </button>
        </div>
      ) : (
        <form onSubmit={submitDraftBooking} className="mt-5 space-y-4">
          <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
            <p>
              <span className="font-semibold">Selected Slot:</span> {selectedDateLabel} ·{" "}
              {selectedTimeSlot}
            </p>
          </div>

          <label className="block text-sm">
            <span className="mb-2 block font-medium">Full Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none ring-orange-400 transition focus:ring-2"
              placeholder="Kamal Perera"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-2 block font-medium">Email</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none ring-orange-400 transition focus:ring-2"
              placeholder="you@example.com"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-2 block font-medium">Phone Number</span>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              type="tel"
              required
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none ring-orange-400 transition focus:ring-2"
              placeholder="+94 77 123 4567"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-2 block font-medium">Vehicle Type</span>
            <select
              value={vehicleType}
              onChange={(event) => setVehicleType(event.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none ring-orange-400 transition focus:ring-2"
            >
              <option>Sedan</option>
              <option>SUV</option>
              <option>Van</option>
              <option>Hatchback</option>
              <option>Pickup</option>
            </select>
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="h-11 flex-1 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 transition hover:border-slate-500"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 flex-1 rounded-xl bg-orange-600 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating Draft Booking..." : "Book and Send Verification"}
            </button>
          </div>
        </form>
      )}

      {errorMessage ? (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      {successMessage ? (
        <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <p>{successMessage}</p>
          {verificationUrl ? (
            <p className="mt-2">
              Verification link:{" "}
              <a
                href={verificationUrl}
                className="font-semibold underline decoration-emerald-700 underline-offset-2"
              >
                Confirm my booking
              </a>
            </p>
          ) : (
            <p className="mt-2">Check your email inbox to confirm the booking.</p>
          )}
        </div>
      ) : null}
    </div>
  );
};
