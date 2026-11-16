import type { Metadata, Viewport } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VancoBiz — Vancouver's Boldest Creative Marketing Agency",
  description:
    "Be Creative, Not Repetitive. High-ROI digital strategy, viral video production and real-world community activations in Vancouver.",
  openGraph: {
    title: "VancoBiz — Be Creative, Not Repetitive",
    description:
      "Vancouver's boldest creative marketing agency: viral video, paid ads, 3D web and event activations.",
    type: "website",
    locale: "en_CA",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090B",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable} antialiased`}>
      <body className="noise min-h-screen">{children}</body>
    </html>
  );
}
