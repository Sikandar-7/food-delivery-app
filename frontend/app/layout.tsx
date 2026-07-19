import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Order.pk | Feast Your Senses, Fast and Fresh",
  description: "Order Restaurant food, takeaway and groceries. Enter a postcode to see what we deliver.",
  authors: [{ name: "Quantum Labs", url: "https://portfolio-five-black-18.vercel.app" }],
  creator: "Quantum Labs",
  publisher: "Quantum Labs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
