import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai,Geist, Geist_Mono,Nunito } from "next/font/google";
import { SessionProvider } from "@/providers/SessionProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ibmPlexSans = IBM_Plex_Sans_Thai({
  subsets: ["latin","thai"],
  weight: ["400","500","700"],
  variable: "--font-ibm",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400","600","700"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "LynxOps",
  description: "Lynx Desk For Tracking Members Task",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${ibmPlexSans.variable} ${nunito.variable} antialiased`}>
        <SessionProvider>
        {children}
        </SessionProvider>
      </body>
    </html>
  );
}
