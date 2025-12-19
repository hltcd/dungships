import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hoclaptrinhcungdung.com"),
  title: {
    default: "Học Lập Trình Cùng Dũng | Khóa Học & Source Code Lập Trình",
    template: "%s | Học Lập Trình Cùng Dũng"
  },
  description: "Cung cấp khóa học lập trình và source code website chất lượng cao. Học Next.js, React, Node.js từ dự án thực tế giúp bạn bứt phá sự nghiệp lập trình.",
  keywords: ["học lập trình", "source code website", "khóa học lập trình", "nextjs", "reactjs", "nodejs", "hoclaptrinhcungdung"],
  authors: [{ name: "Học Lập Trình Cùng Dũng" }],
  creator: "Học Lập Trình Cùng Dũng",
  publisher: "Học Lập Trình Cùng Dũng",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://hoclaptrinhcungdung.com",
    siteName: "Học Lập Trình Cùng Dũng",
    title: "Học Lập Trình Cùng Dũng | Khóa Học & Source Code Lập Trình",
    description: "Cung cấp khóa học lập trình và source code website chất lượng cao. Học Next.js, React, Node.js từ dự án thực tế.",
    images: [
      {
        url: "/og-image.png", // We'll assume this exists or use broad default
        width: 1200,
        height: 630,
        alt: "Học Lập Trình Cùng Dũng",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Học Lập Trình Cùng Dũng | Khóa Học & Source Code Lập Trình",
    description: "Học lập trình qua dự án thực tế cực nhanh và hiệu quả.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/logo.png", // Fallback to public/logo.png
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import ThreeBackground from "@/components/ThreeBackground";
import SearchSchema from "@/components/SearchSchema";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.variable} antialiased font-sans bg-[#0b0b10] text-white`}>
        {/* SEO Structured Data */}
        <SearchSchema />
        
        {/* Global Background Elements */}
        <ThreeBackground />
        
        {children}
      </body>
    </html>
  );
}
