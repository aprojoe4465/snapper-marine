import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Service Area",
  description:
    "Snapper Marine serves Coral Springs, Port St. Lucie, and South Florida. Exact radius TBD.",
};

export default function ServiceAreaPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Florida coverage</span>
          <h1>Service area</h1>
          <p>
            We serve boaters in and around our primary Florida markets, with
            mobile marine travel subject to distance and scheduling.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="area-list">
            {site.serviceAreas.map((area) => (
              <div key={area.name} className="area-item">
                <div>
                  <strong>{area.name}</strong>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    {area.note}
                  </div>
                </div>
                <span className="badge">FL</span>
              </div>
            ))}
          </div>

          <p className="note" style={{ marginTop: "1.5rem", display: "block" }}>
            Exact service radius and travel fees TBD — if you&apos;re outside these
            areas, still reach out; we may be able to help.
          </p>

          <div className="cta-row" style={{ marginTop: "2rem" }}>
            <Link href="/book" className="btn btn-primary">
              Request service
            </Link>
            <a href={site.phoneHref} className="btn btn-ghost">
              Call {site.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
