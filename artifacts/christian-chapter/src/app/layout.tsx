import type { Metadata } from "next";
import { EB_Garamond, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/layout/site-chrome";

const garamond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-garamond",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Christian Chapter — UK Christian dating for your next chapter",
    template: "%s | Christian Chapter",
  },
  description:
    "Christian dating for your next chapter. Meet genuine Christian singles aged 40–70 who share your faith, values and hopes for what comes next. A UK founding cohort with considered introductions, when the community is ready.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://christianchapter.co.uk"
  ),
  openGraph: {
    siteName: "Christian Chapter",
    locale: "en_GB",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={`${garamond.variable} ${grotesk.variable}`}>
      <body className="flex flex-col min-h-screen">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
