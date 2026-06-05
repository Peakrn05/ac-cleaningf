"use client";
import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "en" | "th";

const T = {
  en: {
    home: "Home", bookService: "Book Service", myBookings: "My Bookings",
    admin: "Admin", signIn: "Sign In", register: "Register", signOut: "Sign Out",
    searchPlaceholder: "Search AC cleaning services...",
    bookNow: "Book Now", freeAccount: "Free Account →",
    servicesFound: "services found", sortBy: "Sort by:", popularity: "Popularity",
    priceLow: "Price: Low to High", priceHigh: "Price: High to Low", rating: "Rating",
    filterServices: "Filter Services", acType: "AC Type", priceRange: "Price Range",
    applyFilters: "Apply Filters",
    // booking
    bookAService: "Book a Service", easySteps: "5 easy steps including secure payment",
    service: "Service", schedule: "Schedule", details: "Details",
    review: "Review", payment: "Payment",
    chooseService: "Choose a Service", chooseDateTime: "Choose Date & Time",
    yourDetails: "Your Details", reviewOrder: "Review Your Order", securePayment: "Secure Payment",
    preferredDate: "Preferred Date", timeSlot: "Time Slot", numberOfUnits: "Number of Units",
    fullName: "Full Name", email: "Email", phone: "Phone",
    address: "Service Address", notes: "Notes (optional)",
    namePlaceholder: "John Smith", emailPlaceholder: "you@example.com",
    addressPlaceholder: "Full address including unit/floor number",
    notesPlaceholder: "e.g. Gate code, specific AC issue...",
    next: "Next", back: "Back", proceedPayment: "Proceed to Payment",
    amountDue: "Amount Due", total: "Total Paid",
    confirmBooking: "Booking & Payment Confirmed! 🎉",
    viewBookings: "View My Bookings", backHome: "Back to Home",
    payWith: "Payment successful via",
    sslEncrypted: "SSL Encrypted",
    cardNumber: "Card Number", cardHolder: "Cardholder Name",
    expiry: "Expiry Date", cvv: "CVV / CVC",
    paySecurely: "Pay Securely",
    processingPayment: "Processing payment…",
    connectingPaypal: "Connecting to PayPal…",
    continueAsGuest: "Continue as Guest",
    guestNote: "Booking as guest — ",
    guestNoteLink: "create an account",
    guestNoteEnd: " to track your bookings later.",
    // auth
    welcomeBack: "Welcome back", signInDesc: "Sign in to manage your bookings",
    noAccount: "No account?", createOneFree: "Create one free →",
    createAccount: "Create your account", alreadyRegistered: "Already registered?",
    signInLink: "Sign in",
    // register
    password: "Password", confirmPassword: "Confirm Password",
    nameStar: "Full Name *", emailStar: "Email *", passwordStar: "Password *",
    confirmStar: "Confirm Password *",
    creating: "Creating…", signingIn: "Signing in…",
    // validation
    invalidEmail: "Please enter a valid email address (must include @).",
    passwordMismatch: "Passwords do not match.",
    passwordShort: "Password must be at least 6 characters.",
  },
  th: {
    home: "หน้าหลัก", bookService: "จองบริการ", myBookings: "การจองของฉัน",
    admin: "แอดมิน", signIn: "เข้าสู่ระบบ", register: "ลงทะเบียน", signOut: "ออกจากระบบ",
    searchPlaceholder: "ค้นหาบริการล้างแอร์...",
    bookNow: "จองเลย", freeAccount: "สร้างบัญชีฟรี →",
    servicesFound: "บริการที่พบ", sortBy: "เรียงตาม:", popularity: "ยอดนิยม",
    priceLow: "ราคา: ต่ำ-สูง", priceHigh: "ราคา: สูง-ต่ำ", rating: "คะแนน",
    filterServices: "กรองบริการ", acType: "ประเภทแอร์", priceRange: "ช่วงราคา",
    applyFilters: "กรองผล",
    // booking
    bookAService: "จองบริการ", easySteps: "5 ขั้นตอนง่ายๆ รวมถึงการชำระเงินที่ปลอดภัย",
    service: "บริการ", schedule: "กำหนดการ", details: "รายละเอียด",
    review: "ตรวจสอบ", payment: "ชำระเงิน",
    chooseService: "เลือกบริการ", chooseDateTime: "เลือกวันและเวลา",
    yourDetails: "ข้อมูลของคุณ", reviewOrder: "ตรวจสอบคำสั่งซื้อ", securePayment: "ชำระเงินปลอดภัย",
    preferredDate: "วันที่ต้องการ", timeSlot: "ช่วงเวลา", numberOfUnits: "จำนวนเครื่อง",
    fullName: "ชื่อ-นามสกุล", email: "อีเมล", phone: "เบอร์โทรศัพท์",
    address: "ที่อยู่บริการ", notes: "หมายเหตุ (ถ้ามี)",
    namePlaceholder: "สมชาย ใจดี", emailPlaceholder: "email@example.com",
    addressPlaceholder: "ที่อยู่เต็ม รวมถึงชั้น/ห้อง",
    notesPlaceholder: "เช่น รหัสประตู, ปัญหาเฉพาะของแอร์...",
    next: "ถัดไป", back: "ย้อนกลับ", proceedPayment: "ไปยังการชำระเงิน",
    amountDue: "ยอดที่ต้องชำระ", total: "ยอดชำระทั้งหมด",
    confirmBooking: "ยืนยันการจองและการชำระเงินแล้ว! 🎉",
    viewBookings: "ดูการจองของฉัน", backHome: "กลับหน้าหลัก",
    payWith: "ชำระเงินสำเร็จผ่าน",
    sslEncrypted: "เข้ารหัส SSL",
    cardNumber: "หมายเลขบัตร", cardHolder: "ชื่อบนบัตร",
    expiry: "วันหมดอายุ", cvv: "CVV / CVC",
    paySecurely: "ชำระเงินอย่างปลอดภัย",
    processingPayment: "กำลังประมวลผล...",
    connectingPaypal: "กำลังเชื่อมต่อ PayPal...",
    continueAsGuest: "ดำเนินการในฐานะแขก",
    guestNote: "จองในฐานะแขก — ",
    guestNoteLink: "สร้างบัญชี",
    guestNoteEnd: " เพื่อติดตามการจองในภายหลัง",
    // auth
    welcomeBack: "ยินดีต้อนรับกลับ", signInDesc: "เข้าสู่ระบบเพื่อจัดการการจองของคุณ",
    noAccount: "ยังไม่มีบัญชี?", createOneFree: "สร้างบัญชีฟรี →",
    createAccount: "สร้างบัญชีของคุณ", alreadyRegistered: "มีบัญชีแล้ว?",
    signInLink: "เข้าสู่ระบบ",
    password: "รหัสผ่าน", confirmPassword: "ยืนยันรหัสผ่าน",
    nameStar: "ชื่อ-นามสกุล *", emailStar: "อีเมล *", passwordStar: "รหัสผ่าน *",
    confirmStar: "ยืนยันรหัสผ่าน *",
    creating: "กำลังสร้าง...", signingIn: "กำลังเข้าสู่ระบบ...",
    invalidEmail: "กรุณากรอกอีเมลที่ถูกต้อง (ต้องมี @)",
    passwordMismatch: "รหัสผ่านไม่ตรงกัน",
    passwordShort: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
  },
} as const;

export type Translations = Record<string, string>;

interface LangCtx { lang: Lang; t: Translations; toggle: () => void; }
const Ctx = createContext<LangCtx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const toggle = () => setLang((l) => (l === "en" ? "th" : "en"));
  return <Ctx.Provider value={{ lang, t: T[lang], toggle }}>{children}</Ctx.Provider>;
}

export const useLang = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang outside LangProvider");
  return ctx;
};

export const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
