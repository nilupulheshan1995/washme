import { NextResponse } from "next/server";
import { searchBookingsByCustomer } from "@/lib/bookings";

type BookingSearchRequest = {
  email: string;
  phoneNumber: string;
};

const isValidString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<BookingSearchRequest>;

    const email = body.email?.trim();
    const phoneNumber = body.phoneNumber?.trim();

    if (!isValidString(email) || !isValidString(phoneNumber)) {
      return NextResponse.json(
        { error: "Email and phone number are required." },
        { status: 400 }
      );
    }

    const bookings = await searchBookingsByCustomer(email, phoneNumber);

    return NextResponse.json(
      {
        bookings,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to search customer bookings.",
      },
      { status: 500 }
    );
  }
}
