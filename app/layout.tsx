import type React from "react";
import type { Metadata } from "next";
import { Atkinson_Hyperlegible_Next } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const atkinson = Atkinson_Hyperlegible_Next({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://budget.city"),
  title: "Budget.City",
  description: "Financial data for North Texas cities",
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={atkinson.className + " antialiased"}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
