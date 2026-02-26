import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import TabVisibility from "@/components/landing/TabVisibility";
import { SwissGridBackground } from "@/components/ui/SwissGridBackground";
import { Agentation } from "agentation";
import "./globals.css";

// Primary body font - Inter for exceptional readability
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Display font - Instrument Serif for elegant headings (Oatmeal Design System)
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400"], // Instrument Serif only has regular weight
  display: "swap",
});

// Code font - JetBrains Mono for syntax highlighting
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-code",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stav Fernandes - Full Stack Developer & Technical Writer",
  description:
    "Frontend developer. Building with AI, teaching what I learn.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f6ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e0c" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TabVisibility awayMessage="Feeling lonely here... come back!" enabled />
          <SwissGridBackground />
          {children}
          {process.env.NODE_ENV === "development" && <Agentation />}
        </ThemeProvider>
      </body>
    </html>
  );
}
