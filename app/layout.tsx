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
  metadataBase: new URL("https://stavfernandes.dev"),
  title: {
    default: "Stav Fernandes - Frontend Developer & Developer Experience Engineer",
    template: "%s | Stav Fernandes",
  },
  description:
    "I make complex AI and web concepts simple. Frontend developer and technical educator with a background in finance and fullstack development. Based in Thailand, open to remote work.",
  keywords: [
    "frontend developer",
    "developer experience",
    "React",
    "Next.js",
    "TypeScript",
    "AI SDK",
    "technical educator",
    "developer relations",
  ],
  authors: [{ name: "Stav Fernandes", url: "https://stavfernandes.dev" }],
  creator: "Stav Fernandes",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://stavfernandes.dev",
    siteName: "Stav Fernandes",
    title: "Stav Fernandes - Frontend Developer & Developer Experience Engineer",
    description:
      "I make complex AI and web concepts simple. Frontend developer and technical educator with a background in finance and fullstack development.",
    images: [
      {
        url: "/og?title=Stav%20Fernandes&description=Frontend%20Developer%20%26%20Developer%20Experience%20Engineer",
        width: 1200,
        height: 630,
        alt: "Stav Fernandes - Frontend Developer & Developer Experience Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stav Fernandes - Frontend Developer & Developer Experience Engineer",
    description:
      "I make complex AI and web concepts simple. Frontend developer and technical educator.",
    creator: "@CodewithStav",
    images: ["/og?title=Stav%20Fernandes&description=Frontend%20Developer%20%26%20Developer%20Experience%20Engineer"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://stavfernandes.dev",
  },
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
