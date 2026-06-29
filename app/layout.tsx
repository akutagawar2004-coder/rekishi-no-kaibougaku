import type { Metadata } from "next";
import { EB_Garamond, Lora, Source_Sans_3, Noto_Serif_JP } from "next/font/google";
import "./globals.css";

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans-3",
  subsets: ["latin"],
  display: "swap",
});

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "歴史の解剖学",
    template: "%s | 歴史の解剖学",
  },
  description: "歴史は、解剖すると面白い。",
  openGraph: {
    siteName: "歴史の解剖学",
    type: "website",
  },
  verification: {
    google: "nrezYP6LL6ambC3qhPNeNuhZlWJT-lhktA83Ed-uswg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${ebGaramond.variable} ${lora.variable} ${sourceSans3.variable} ${notoSerifJP.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
