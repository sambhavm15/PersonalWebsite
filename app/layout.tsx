import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import RevealProvider from "@/components/RevealProvider";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sanskriti Clothing — Heritage weaves, worn for today",
  description:
    "Handcrafted kurtas, bandhgalas, sherwanis and more. Born of a textile family in Indore, made for the modern wardrobe.",
  openGraph: {
    title: "Sanskriti Clothing",
    description: "Heritage weaves, worn for today.",
    siteName: "Sanskriti Clothing",
    type: "website",
  },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="bg-ivory text-ink antialiased selection:bg-gold/20">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-gold focus:px-3 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <RevealProvider>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </RevealProvider>
        <FloatingContact />
      </body>
    </html>
  );
}
