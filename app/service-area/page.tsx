import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Service Area",
  description:
    `${site.name} serves ${site.serviceAreaSummary}.`,
};

export default function ServiceAreaPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Florida coverage</span>
          <h1>Service area</h1>
          <p>
            We serve boaters throughout {site.serviceAreaSummary}, with mobile
            marine travel subject to availability and scheduling.
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
            Travel availability and fees depend on location and scheduling. If you
            are outside these counties, still reach out; we may be able to help.
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
