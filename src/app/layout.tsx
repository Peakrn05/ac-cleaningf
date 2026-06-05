import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth/AuthProvider";
import { BookingProvider } from "@/context/booking/BookingProvider";
import { LangProvider } from "@/context/lang/LangProvider";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AirCare Pro — AC Cleaning & Service",
  description: "Professional air conditioner cleaning and maintenance booking",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={lato.variable}>
        <LangProvider>
          <AuthProvider>
            <BookingProvider>{children}</BookingProvider>
          </AuthProvider>
        </LangProvider>
      </body>
    </html>
  );
}
