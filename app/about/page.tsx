import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Snapper Marine, LLC — mobile marine service at your dock, marina, or home in Florida.",
};

export default function AboutPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Our company</span>
          <h1>About {site.name}</h1>
          <p>
            Mobile marine service built around reliability, clear communication,
            and getting you back on the water — we come to your boat.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container prose" style={{ maxWidth: 720 }}>
          <h2>Who we are</h2>
          <p>
            {site.name} is a mobile marine business serving boaters in Coral
            Springs, Port St. Lucie, and South Florida. We come to your dock,
            marina, or home.
          </p>
          <p>
            Whether you need diagnostics, maintenance, or repairs, we focus on
            honest assessments and quality workmanship where your boat already
            sits.
          </p>

          <h2>What matters to us</h2>
          <ul>
            <li>Clear estimates and communication before work begins</li>
            <li>Professional standards on every on-site job</li>
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
