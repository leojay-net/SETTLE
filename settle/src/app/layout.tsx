import type { Metadata } from "next";
import "./globals.css";
import GlobalNav from "../components/Navbar";
import Providers from "../components/Providers";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "SETTLE - Accept Any Crypto, Settle in One Token",
  description: "Accept payments in any cryptocurrency while receiving settlements in your preferred token on your chosen blockchain.",
  keywords: ["crypto payments", "blockchain", "web3", "CCIP", "settlement"],
  authors: [{ name: "SETTLE Team" }],
  openGraph: {
    title: "SETTLE - Crypto Payment Infrastructure",
    description: "Accept any crypto, settle in one token",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head></head>
      <body className={`${inter.className} antialiased`}>
        {/* Global Navbar */}
        <Providers>
          <div id="app-root" className="min-h-screen">
            <GlobalNav />
            <main className="pt-24">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}