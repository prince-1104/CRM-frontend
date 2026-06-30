import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
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

// Google Ads tag ID (from your Google Ads diagnostics screenshot).
// If your Google Ads console shows a different ID, update it here.
const GOOGLE_TAG_ID = "AW-1804975853";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Preconnect to Google Fonts and R2 CDN for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pub-e2e706ed2ae544689d07df5df488ae62.r2.dev" />
        {/* Material Symbols — loaded as stylesheet (non-render-blocking via font-display=swap) */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${manrope.variable} bg-surface font-body text-on-surface antialiased selection:bg-primary selection:text-on-primary`}
      >
        {children}

        {/* Google Ads / gtag - required for Google Ads diagnostics & conversion tracking */}
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_TAG_ID}');
          `}
        </Script>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
