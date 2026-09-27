import type { Metadata, Viewport } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/800.css";
import "./globals.css";
import { business } from "@/lib/content";

export const viewport: Viewport = {
  themeColor: "#2A4836",
};

const siteUrl = "https://daya-enterprises.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Daya Enterprises | LED Displays, CCTV, Road Safety & Infrastructure Solutions",
  description:
    "Daya Enterprises provides LED display supply and installation, LED AMC, CCTV installation, gantry fabrication, road safety solutions, thermoplastic road marking, RPM installation, road signage and infrastructure services in Pune, Maharashtra.",
  keywords: [
    "LED display Pune",
    "CCTV installation Pune",
    "gantry fabrication",
    "road safety solutions",
    "thermoplastic road marking",
    "RPM installation",
    "road signage",
    "Daya Enterprises",
  ],
  authors: [{ name: business.name }],
  openGraph: {
    title: "Daya Enterprises | LED Displays, CCTV, Road Safety & Infrastructure Solutions",
    description:
      "Technology, infrastructure and road-safety solutions — LED displays, CCTV, gantry fabrication, road marking and signage in Pune, Maharashtra.",
    url: siteUrl,
    siteName: business.name,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daya Enterprises | LED Displays, CCTV, Road Safety & Infrastructure Solutions",
    description:
      "Technology, infrastructure and road-safety solutions in Pune, Maharashtra.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/brand/apple-touch-icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: business.name,
  foundingDate: String(business.established),
  telephone: business.phone,
  email: business.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: business.city,
    postalCode: business.pin,
    addressRegion: business.state,
    addressCountry: business.country,
  },
  description:
    "Daya Enterprises provides technology, infrastructure, road-safety, LED display, surveillance, fabrication, and installation solutions for commercial, industrial, government, infrastructure, and roadside applications.",
  areaServed: "Pune, Maharashtra, India",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-paper text-ink">{children}</body>
    </html>
  );
}
