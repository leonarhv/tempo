import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { ThemeRegistry } from "@/components/theme-registry";
import "./globals.css";

const bodyFont = localFont({
  src: "../public/fonts/manrope.ttf",
  variable: "--font-body",
  display: "swap",
});
const displayFont = localFont({
  src: "../public/fonts/cormorant-garamond.ttf",
  variable: "--font-display",
  display: "swap",
});
const handwritingFont = localFont({
  src: "../public/fonts/caveat.ttf",
  variable: "--font-handwriting",
  display: "swap",
});

const playTitle = "Tempo: Essa noite eu vou sonhar com você";
const playDescription =
  "27, 28 e 29 de novembro, às 19h e às 21h. Teatro Escola Macunaíma, Teatro 4.";
const socialImage = {
  url: "/images/tempo-og.jpg",
  width: 958,
  height: 635,
  type: "image/jpeg",
  alt: "Arte de Tempo: Essa noite eu vou sonhar com você, com lettering azul sobre fundo lilás.",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://tempo.nomacu.com",
  ),
  title: playTitle,
  description: playDescription,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Tempo",
    url: "/",
    title: playTitle,
    description: playDescription,
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: playTitle,
    description: playDescription,
    images: [{ url: socialImage.url, alt: socialImage.alt }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${bodyFont.variable} ${displayFont.variable} ${handwritingFont.variable}`}
    >
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
