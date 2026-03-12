import { NextResponse } from "next/server";
import { createPendingBooking, markBookingEmailStatus } from "@/lib/bookings";
import { sendVerificationEmail } from "@/lib/email";
import { getStoreBySlug } from "@/lib/stores";

type DraftBookingRequest = {
  storeSlug: string;
  customerName: string;
  email: string;
  phoneNumber: string;
  vehicleType: string;
  bookingDate: string;
  bookingTime: string;
};

const isValidString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<DraftBookingRequest>;

    const storeSlug = body.storeSlug?.trim();
    const customerName = body.customerName?.trim();
    const email = body.email?.trim();
    const phoneNumber = body.phoneNumber?.trim();
    const vehicleType = body.vehicleType?.trim();
    const bookingDate = body.bookingDate?.trim();
    const bookingTime = body.bookingTime?.trim();

    if (
      !isValidString(storeSlug) ||
      !isValidString(customerName) ||
      !isValidString(email) ||
      !isValidString(phoneNumber) ||
      !isValidString(vehicleType) ||
      !isValidString(bookingDate) ||
      !isValidString(bookingTime)
    ) {
      return NextResponse.json(
        { error: "All booking fields are required." },
        { status: 400 }
      );
    }

    const store = getStoreBySlug(storeSlug);
    if (!store) {
      return NextResponse.json({ error: "Store not found." }, { status: 404 });
    }

    const { booking, verificationToken } = await createPendingBooking({
      storeSlug,
      storeName: store.name,
      storeAddress: store.address,
      storeMainImageUrl: store.heroImageUrl,
      storeGoogleMapsUrl: store.googleMapsUrl,
      customerName,
      email,
      phoneNumber,
      vehicleType,
      bookingDate,
      bookingTime,
    });

    const origin = new URL(request.url).origin;
    const verificationUrl = `${origin}/verify/${verificationToken}`;
    let emailResult: {
      delivered: boolean;
      provider: "resend" | "console";
      messageId?: string;
    };
    try {
      emailResult = await sendVerificationEmail({
        to: email,
        customerName,
        storeName: booking.storeName,
        storeAddress: booking.storeAddress,
        storeMainImageUrl: booking.storeMainImageUrl,
        storeGoogleMapsUrl: booking.storeGoogleMapsUrl,
        bookingDate,
        bookingTime,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        verificationUrl,
      });
    } catch {
      emailResult = { delivered: false, provider: "console" };
    }

    await markBookingEmailStatus(
      booking.id,
      emailResult.delivered ? "sent" : "failed",
      emailResult.provider,
      emailResult.messageId
    );

    const inDevelopment = process.env.NODE_ENV !== "production";

    return NextResponse.json(
      {
        message: emailResult.delivered
          ? "Draft booking created. Verification email sent."
          : "Draft booking created, but email provider is not configured yet. Use the verification link below for local testing.",
        verificationUrl: inDevelopment ? verificationUrl : undefined,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Malformed request payload." },
      { status: 400 }
    );
  }
}
