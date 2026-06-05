import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth/AuthProvider";
import { BookingProvider } from "@/context/booking/BookingProvider";

export const metadata: Metadata = {
  title: "AirCare Pro — AC Cleaning & Service",
  description: "Professional air conditioner cleaning and maintenance booking",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <BookingProvider>{children}</BookingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
