import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mobile Marine",
  description:
    "On-site mobile marine service from Snapper Marine — dock, marina, or home across South Florida.",
};

export default function MobileMarinePage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">We come to you</span>
          <h1>Mobile marine service</h1>
          <p>
            Dockside, marina, or trailer — Snapper Marine brings diagnostics and
            repairs to your location so you spend less time hauling and more time
            on the water.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container prose">
          <div className="card-grid" style={{ marginBottom: "2rem" }}>
            <article className="card">
              <div className="icon">📍</div>
              <h3>At your dock or marina</h3>
              <p>
                Ideal for troubleshooting that doesn&apos;t require a full shop
                haul-out. Tell us the slip or marina when you book.
              </p>
            </article>
            <article className="card">
              <div className="icon">🏠</div>
              <h3>Home / trailer</h3>
              <p>
                Service at your property when the boat is on a trailer or stored
                at home — subject to access and local coverage.
              </p>
            </article>
            <article className="card">
              <div className="icon">🛠</div>
              <h3>What we handle on-site</h3>
              <p>
                Diagnostics, many repairs, and maintenance. Complex jobs may
                still need shop time — we&apos;ll advise after the request.
              </p>
            </article>
          </div>

          <h2>How it works</h2>
          <ol>
            <li>Submit a <Link href="/book">service request</Link> with boat and location details.</li>
            <li>We confirm availability, travel, and a time window.</li>
            <li>Our tech arrives on-site and gets to work — or schedules shop follow-up if needed.</li>
          </ol>

          <p>
            Coverage focuses on Coral Springs, Port St. Lucie, and broader South
            Florida. Exact travel radius is still being finalized.
          </p>
          <p className="note">Service area radius TBD — contact us to confirm your location.</p>

          <div className="cta-row" style={{ marginTop: "2rem" }}>
            <Link href="/book" className="btn btn-primary">
              Book mobile service
            </Link>
            <a href={site.phoneHref} className="btn btn-chrome">
              Call {site.phoneDisplay}
            </a>
            <Link href="/service-area" className="btn btn-ghost">
              Service area
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
