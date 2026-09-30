import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "About Snapper Marine, LLC — marine repair and mobile marine service in Florida.",
};

export default function AboutPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Our company</span>
          <h1>About {site.name}</h1>
          <p>
            Professional marine repair and mobile marine service built around
            reliability, clear communication, and getting you back on the water.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container prose" style={{ maxWidth: 720 }}>
          <h2>Who we are</h2>
          <p>
            {site.name} provides marine repair shop services and convenient
            mobile marine work for boaters in Coral Springs, Port St. Lucie, and
            South Florida.
          </p>
          <p>
            Whether you need diagnostics, maintenance, or repairs, we focus on
            honest assessments and quality workmanship — in the shop or at your
            dock, marina, or home.
          </p>

          <h2>What matters to us</h2>
          <ul>
            <li>Clear estimates and communication before work begins</li>
            <li>Shop-quality standards on mobile jobs whenever possible</li>
            <li>Respect for your time and your vessel</li>
          </ul>

          <p>
            Have questions or want to schedule?{" "}
            <Link href="/contact">Contact us</Link> or{" "}
            <Link href="/book">book a service request</Link>.
          </p>

          <div className="cta-row" style={{ marginTop: "1.5rem" }}>
            <Link href="/book" className="btn btn-primary">
              Book service
            </Link>
            <a href={site.phoneHref} className="btn btn-chrome">
              {site.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
