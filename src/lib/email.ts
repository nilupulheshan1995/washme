import Nodemailer from "nodemailer";

type SendVerificationEmailInput = {
  to: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  storeName: string;
  storeAddress: string;
  storeMainImageUrl: string;
  storeGoogleMapsUrl: string;
  bookingDate: string;
  bookingTime: string;
  verificationUrl: string;
};

type SendVerificationEmailResult = {
  delivered: boolean;
  provider: "gmail" | "console";
  messageId?: string;
};

const emailHtml = ({
  customerName,
  customerEmail,
  customerPhone,
  storeName,
  storeAddress,
  storeMainImageUrl,
  storeGoogleMapsUrl,
  bookingDate,
  bookingTime,
  verificationUrl,
}: SendVerificationEmailInput) => `
  <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;padding:20px;color:#0f172a">
    <h2 style="margin-bottom:12px;">Confirm your WashMe booking</h2>
    <p>Hi ${customerName},</p>

    <div style="margin:18px 0;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <img src="${storeMainImageUrl}" alt="${storeName}" style="display:block;width:100%;height:220px;object-fit:cover;" />
      <div style="padding:14px;">
        <h3 style="margin:0 0 6px;font-size:18px;">${storeName}</h3>
        <p style="margin:0 0 12px;color:#334155;">${storeAddress}</p>
        <a href="${storeGoogleMapsUrl}" style="color:#1d4ed8;font-weight:600;text-decoration:none;">Open Google Maps</a>
      </div>
    </div>

    <div style="margin:14px 0;padding:14px;border:1px solid #e2e8f0;border-radius:12px;">
      <p style="margin:0 0 8px;"><strong>Booking Details</strong></p>
      <p style="margin:0;">Date: ${bookingDate}</p>
      <p style="margin:4px 0 0;">Time: ${bookingTime}</p>
    </div>

    <div style="margin:14px 0;padding:14px;border:1px solid #e2e8f0;border-radius:12px;">
      <p style="margin:0 0 8px;"><strong>Customer Details</strong></p>
      <p style="margin:0;">Name: ${customerName}</p>
      <p style="margin:4px 0 0;">Email: ${customerEmail}</p>
      <p style="margin:4px 0 0;">Phone: ${customerPhone}</p>
    </div>

    <p style="margin:24px 0;">
      <a
        href="${verificationUrl}"
        style="background:#1d4ed8;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:600;"
      >
        Confirm Booking
      </a>
    </p>

    <p style="font-size:13px;color:#475569;">
      This link expires in 30 minutes. If you did not request this booking, you can ignore this email.
    </p>
  </div>
`;

export const sendVerificationEmail = async (
  input: SendVerificationEmailInput
): Promise<SendVerificationEmailResult> => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const senderEmail = process.env.EMAIL_FROM?.trim() || emailUser;

  if (!emailUser || !emailPass) {
    console.info("[email:console_fallback] verification payload", {
      to: input.to,
      storeName: input.storeName,
      bookingDate: input.bookingDate,
      bookingTime: input.bookingTime,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      verificationUrl: input.verificationUrl,
      storeGoogleMapsUrl: input.storeGoogleMapsUrl,
    });

    return {
      delivered: false,
      provider: "console",
    };
  }

  const transporter = Nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const sendInfo = await transporter.sendMail({
    from: senderEmail,
    to: [input.to],
    subject: `Confirm your WashMe booking at ${input.storeName}`,
    html: emailHtml(input),
    text: [
      `Confirm your WashMe booking`,
      `Service Center: ${input.storeName}`,
      `Address: ${input.storeAddress}`,
      `Google Map: ${input.storeGoogleMapsUrl}`,
      `Booking Date: ${input.bookingDate}`,
      `Booking Time: ${input.bookingTime}`,
      `Customer Name: ${input.customerName}`,
      `Customer Email: ${input.customerEmail}`,
      `Customer Phone: ${input.customerPhone}`,
      `Confirmation Link: ${input.verificationUrl}`,
    ].join("\n"),
  });

  return {
    delivered: true,
    provider: "gmail",
    messageId: sendInfo.messageId,
  };
};
