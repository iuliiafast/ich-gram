import localFont from "next/font/local";
import "./styles/globals.css";
import React from "react";
import ClientProviders from "../components/ClientProviders";
import TokenInitializer from "../components/TokenInitializer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

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
        <ClientProviders>
          <TokenInitializer />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
