import type { Metadata } from "next";
import { Noto_Naskh_Arabic, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const notoArabic = Noto_Naskh_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "أرشيف التاريخ | History Archive",
  description:
    "منصة تاريخية تفاعلية تجمع حياة الشخصيات التاريخية، الحكام والقادة، الحروب والمعارك، الخرائط التاريخية، والخط الزمني للأحداث.",
  keywords: ["تاريخ", "شخصيات تاريخية", "خط زمني", "خرائط تاريخية", "معارك", "أرشيف"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${notoArabic.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
