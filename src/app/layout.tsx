import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../component/Navbar";
import { AuthProvider } from "../lib/AuthContext";

import Footer from "../component/Footer";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Last Call Trips",
  description:
    "Last Call Trips is a premium service that finds you incredibly cheap flight deals. We scour the web to uncover hidden deals, unadvertised sales and mistake fares that saves you at least 40% from average prices.",
  icons: {
    icon: "/faviconn.ico", 
    shortcut: "/faviconn.ico",
    apple: "/faviconn.ico", 
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <AuthProvider>
            <Navbar />
            <main className="pt-28 min-h-screen">{children}</main>
            <Footer />
          </AuthProvider>

        </Providers>
      </body>
    </html>
  );
}
