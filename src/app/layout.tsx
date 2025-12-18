import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "HocLapTrinhCungDung Course Platform",
  description: "Học lập trình cùng HocLapTrinhCungDung",
};

import ThreeBackground from "@/components/ThreeBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${beVietnamPro.variable} antialiased font-sans bg-[#0b0b10] text-white`}>
        {/* Global Background Elements */}
        <ThreeBackground />
        
        {children}
      </body>
    </html>
  );
}
