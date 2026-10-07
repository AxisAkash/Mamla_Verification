import type { Metadata } from "next";
import { Manrope, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const bengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mamla Verification — Verify Before You Pay",
    template: "%s · Mamla Verification",
  },
  description:
    "Verify traffic notices against relevant laws with evidence-backed, plain-language explanations.",
  openGraph: {
    title: "Mamla Verification — Verify Before You Pay",
    description:
      "Evidence-backed, plain-language verification for traffic notices.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${bengali.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
