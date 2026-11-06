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

export const metadata: Metadata = {
  title: {
    default: "Tempo",
    template: "%s | Tempo",
  },
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
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
