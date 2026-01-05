import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { NuqsAdapter } from 'nuqs/adapters/next'
import { ThemeProvider } from "next-themes";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair_display = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Reflet",
  description: "AI-powered book reflection assistant for meaningful reading",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair_display.variable} antialiased`}
      >
        <Navbar />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NuqsAdapter>
            {children}
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
