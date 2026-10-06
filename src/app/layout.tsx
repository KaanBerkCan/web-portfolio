import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollRestoration } from "@/components/ScrollRestoration";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kaanberkcan-web-portfolio.vercel.app"),
  title: "Kaan Berk Can — Game & System Design Portfolio",
  description:
    "Game and system design portfolio by Kaan Berk Can. Digital prototypes, tabletop systems, game concepts, and research in mathematical analytics.",
  openGraph: {
    title: "Kaan Berk Can — Game & System Design Portfolio",
    description:
      "Games, systems design and research by Kaan Berk Can: Dekrawler, Harvey Park, Idle Incrementation and more.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${syne.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        <ScrollRestoration />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
