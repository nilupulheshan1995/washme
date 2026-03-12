import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WashMe | Book Car Wash Slots in Sri Lanka",
  description:
    "Find nearby car wash centers, compare services, and reserve your slot with one-click verification.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
