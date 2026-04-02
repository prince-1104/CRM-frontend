import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Manrope, Space_Grotesk } from "next/font/google";
import Script from "next/script";
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

// Google Ads tag ID (from your screenshot: AW-1404975853).
// If your Google Ads console shows a different ID, update it here.
const GOOGLE_TAG_ID = "AW-1404975853";

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

        {/* Google Ads / gtag - required for Google Ads diagnostics & conversion tracking */}
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`}
          strategy="beforeInteractive"
        />
        <Script id="google-ads-gtag" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_TAG_ID}');
          `}
        </Script>

        <Analytics />
      </body>
    </html>
  );
}
