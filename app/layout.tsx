import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: `${site.name} | Marine Repair & Mobile Marine`,
    template: `%s | ${site.shortName}`,
  },
  description:
    "Snapper Marine, LLC — professional marine repair shop and mobile marine service in Coral Springs, Port St. Lucie, and South Florida. Book service online.",
  metadataBase: new URL(`https://${site.domain}`),
  openGraph: {
    title: site.name,
    description: site.tagline,
    url: `https://${site.domain}`,
    siteName: site.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
