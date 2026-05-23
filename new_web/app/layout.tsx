import type { Metadata, Viewport } from "next";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const notoSans = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-noto-sans",
  display: "swap"
});

const notoSerif = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-noto-serif",
  display: "swap"
});

export const metadata: Metadata = {
  title: "光药医路",
  description: "光药医路联合团支部中医药文化互动网站",
  icons: {
    icon: "/images/brand/guangyao-logo-light.jpg",
    shortcut: "/images/brand/guangyao-logo-light.jpg",
    apple: "/images/brand/guangyao-logo-light.jpg"
  }
};

export const viewport: Viewport = {
  themeColor: "#f6f1e2",
  colorScheme: "light"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <body className="relative min-h-screen font-sans">
        <div className="bg-glow-ambient" aria-hidden="true" />
        <TooltipProvider>
          <MotionProvider>{children}</MotionProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
