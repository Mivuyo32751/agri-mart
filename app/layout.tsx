import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./farmer-mobile.css";
import "./marketing.css";

export const metadata: Metadata = {
  title: "Agri-Mart | Grow together",
  description: "Track crop growth, forecast harvests, and connect farm supply with buyers.",
  applicationName: "Agri-Mart",
};

export const viewport: Viewport = {
  themeColor: "#f6f7f2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
