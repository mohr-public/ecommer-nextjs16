import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalState from "@/context";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "E-commerce Next",
  description: "Venta de productos casuales segñun temporada",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalState>
          <Navbar />
          <main className="flex min-h-screen flex-col mt-[80px]">
            {children}
          </main>
        </GlobalState>
      </body>
    </html>
  );
}
