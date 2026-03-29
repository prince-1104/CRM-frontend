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

export const metadata = {
  title: "Star Uniform | Premium Professional Attire",
  description:
    "Premium uniforms for chef, hotel, restaurant, bar, and catering — crafted for your brand.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${manrope.variable} bg-surface text-on-surface font-body antialiased selection:bg-primary selection:text-on-primary`}
      >
        {children}
      </body>
    </html>
  );
}
