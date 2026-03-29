import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-headline",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Star Uniform | Premium Professional Attire",
  description:
    "Premium uniforms for chef, hotel, restaurant, bar, and catering — crafted for your brand.",
};

/** Enables env(safe-area-inset-*) for notched phones and home-indicator spacing */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${manrope.variable} bg-surface font-body text-on-surface antialiased selection:bg-primary selection:text-on-primary`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
