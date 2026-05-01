import type { Metadata, Viewport } from "next";

import { CookieBanner } from "@/components/cookie-banner";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Easyfest — Le festival pro, sans le prix pro",
    template: "%s · Easyfest",
  },
  description:
    "Easyfest est l'outil de référence des organisateurs de festivals associatifs. Inscription bénévoles, planning, scan QR, bien-être, RGPD-clean. Hébergé en France.",
  metadataBase: new URL(process.env["NEXT_PUBLIC_APP_URL"] ?? "https://easyfest.app"),
  applicationName: "Easyfest",
  authors: [{ name: "Easyfest", url: "https://easyfest.app" }],
  keywords: [
    "logiciel festival",
    "gestion bénévoles",
    "association culturelle",
    "planning festival",
    "billetterie association",
    "RGPD festival",
    "alternative Weezevent",
    "alternative Sourcil",
    "scan QR bénévole",
    "convention bénévolat",
  ],
  icons: {
    icon: [
      { url: "/brand/icons/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/brand/icons/apple-touch-icon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Easyfest",
    title: "Easyfest — Le festival pro, sans le prix pro",
    description:
      "Une seule app pour gérer ton festival : bénévoles, planning, sponsors, conventions, sécurité. Hébergé en EU, 100% RGPD.",
    url: "https://easyfest.app",
    images: [
      {
        url: "/brand/icons/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Easyfest — Le festival pro, sans le prix pro",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Easyfest — Le festival pro, sans le prix pro",
    description:
      "Une seule app pour gérer ton festival : bénévoles, planning, sponsors, conventions, sécurité.",
    images: ["/brand/icons/og-image.svg"],
    creator: "@easyfest_app",
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
  verification: {
    // À remplir après création des comptes Search Console + Bing Webmasters
    // google: "...",
    // other: { "msvalidate.01": "..." },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFF8F0" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1A1A" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        {/* JSON-LD organization (SEO + Knowledge Graph) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Easyfest",
              description:
                "SaaS multi-tenant pour organisateurs de festivals associatifs. Gestion bénévoles, planning, sponsors, conventions, sécurité.",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web, iOS, Android",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "EUR",
                priceSpecification: {
                  "@type": "PriceSpecification",
                  description: "Free pour 50 bénévoles. Crew dès 29€/mois.",
                },
              },
              creator: {
                "@type": "Organization",
                name: "Easyfest",
                url: "https://easyfest.app",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-brand-cream font-sans text-brand-ink antialiased">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
