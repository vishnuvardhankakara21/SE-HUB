import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import AuthProvider from "@/components/providers/AuthProvider";
import SmoothFollower from "@/components/ui/smooth-follower";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, SITE_CONFIG } from "@/lib/seo-config";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_CONFIG.title,
    template: "%s | SE-HUB ANITS",
  },
  description: SITE_CONFIG.description,
  applicationName: SITE_CONFIG.shortName,
  keywords: SITE_CONFIG.keywords,
  authors: [
    {
      name: SITE_CONFIG.author.name,
      url: SITE_CONFIG.author.github,
    },
  ],
  creator: SITE_CONFIG.author.name,
  publisher: SITE_CONFIG.institution.name,
  category: "Education",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.title,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    creator: "@vishnu_kakara",
    images: ["/opengraph-image"],
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
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || "",
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION || "",
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", sizes: "64x64", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <JsonLd />
      </head>
      <body className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 antialiased selection:bg-emerald-500/20 selection:text-emerald-500 transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <SmoothFollower />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
