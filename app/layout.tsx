import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import AuthProvider from "@/components/providers/AuthProvider";
import SmoothFollower from "@/components/ui/smooth-follower";

export const metadata: Metadata = {
  title: "Software Engineering Academic Learning Platform | ANITS",
  description:
    "A dedicated academic learning platform for college Software Engineering subjects featuring 5-unit curriculum notes, 6-mark exam answers, 16 reference architectures, and full-screen diagram drawing studio.",
  authors: [{ name: "KAKARA VISHNU VARDHAN" }],
  creator: "KAKARA VISHNU VARDHAN",
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
