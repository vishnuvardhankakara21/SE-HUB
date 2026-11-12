import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Institutional Registration",
  description:
    "Register your student roll number or faculty credentials to access the 5-unit SE curriculum, exam banks, and diagram studio.",
  alternates: {
    canonical: "/register",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

