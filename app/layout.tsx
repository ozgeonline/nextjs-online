import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const nextFont = Montserrat({
  style: ['normal', 'italic'],
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: "--nextFont",
})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href='https://utfs.io/f/MzCIEEnlPGFDz3NtJidK68vreqQIYxPVF73DR02NHsZcf4oG' />
      </head>
      <body className={nextFont.className}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
