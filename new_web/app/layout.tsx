import type { Metadata, Viewport } from "next";
import "./globals.css";

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
  themeColor: "#eef8f0",
  colorScheme: "light"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
