import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RevealProvider from "@/components/RevealProvider";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sambhav Mehta — Builder, product thinker, photographer",
  description:
    "UC Berkeley M.E.T. student building AI products people actually use — and shooting photos, cooking, and making things in between.",
  metadataBase: new URL("https://sambhavm.com"),
  openGraph: {
    title: "Sambhav Mehta",
    description:
      "UC Berkeley M.E.T. student building AI products people actually use.",
    url: "https://sambhavm.com",
    siteName: "Sambhav Mehta",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="bg-ink text-paper antialiased selection:bg-accent selection:text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <RevealProvider>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </RevealProvider>
      </body>
    </html>
  );
}
