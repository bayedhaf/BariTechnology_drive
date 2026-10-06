import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Nunito_Sans } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-display", weight: ["500", "700", "800"] });
const body = Nunito_Sans({ subsets: ["latin"], variable: "--f-body" });

export const metadata: Metadata = {
  title: "BARI – Egeree Kee Jalqabi | Start Your Future",
  description: "Barnoota teekinooloojii Afaan Oromootiin. Tech education in Afaan Oromoo.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="om" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}