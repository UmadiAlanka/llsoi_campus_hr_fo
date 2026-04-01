import type { Metadata } from "next";
import { Geist, Geist_Mono, Kanit } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast"; //

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Adding Kanit font to match your system's UI branding
const kanit = Kanit({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-kanit",
});

export const metadata: Metadata = {
  title: "LLSOI HR Management System",
  description: "Campus HR Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${kanit.variable} antialiased`}
      >
        {/* The Toaster component enables modern UI alerts globally */}
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 4000,
            style: {
              background: "#333",
              color: "#fff",
            },
            success: {
              style: {
                background: "#155724", // Green for success
              },
            },
            error: {
              style: {
                background: "#721c24", // Red for error
              },
            },
          }} 
        />
        {children}
      </body>
    </html>
  );
}