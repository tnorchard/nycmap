import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const siteUrl = "https://www.nycmap.lol";
const title = "NYC MAP — Own a lot in New York City";
const description =
  "Claim real NYC tax lots as digital deeds. $1 a lot across five boroughs. Group five to plant a flag — anyone can take yours for 1.5×.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · NYC MAP",
  },
  description,
  applicationName: "NYC MAP",
  keywords: [
    "NYC map",
    "New York City lots",
    "buy a city block",
    "digital deed",
    "Manhattan",
    "Brooklyn",
    "Queens",
    "Bronx",
    "Staten Island",
  ],
  authors: [{ name: "NYC MAP" }],
  creator: "NYC MAP",
  publisher: "NYC MAP",
  category: "games",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "NYC MAP",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f4ef",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
