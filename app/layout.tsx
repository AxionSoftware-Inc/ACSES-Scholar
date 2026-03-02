import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { ThemeProvider } from "./providers";
import { AnalyticsTracker } from "./components/analytics/Tracker";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ACSES",
  description: "Software • Academy • Lab",
};

export const revalidate = 3600;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AnalyticsTracker />
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
