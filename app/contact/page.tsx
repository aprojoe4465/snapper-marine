import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${site.name} — call, email, or book a service request online in ${site.serviceAreaSummary}.`,
};

export default function ContactPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Get in touch</span>
          <h1>Contact</h1>
          <p>Call, email, or send a service request — we&apos;ll get back to you promptly.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="card-grid">
            <article className="card">
              <div className="icon">📞</div>
              <h3>Phone</h3>
              <p>
                <a href={site.phoneHref}>{site.phoneDisplay}</a>
              </p>
              <p style={{ marginTop: "0.5rem" }}>Best for urgent issues or same-day questions.</p>
            </article>
            <article className="card">
              <div className="icon">✉</div>
              <h3>Email</h3>
              <p>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </p>
              <p style={{ marginTop: "0.5rem" }}>
                Placeholder mailbox — update when your domain email is live.
              </p>
            </article>
            <article className="card">
              <div className="icon">📋</div>
              <h3>Book online</h3>
              <p>Submit boat details, location, and preferred timing.</p>
              <Link href="/book" className="btn btn-primary" style={{ marginTop: "1rem" }}>
                Service request form
              </Link>
            </article>
          </div>

          <p style={{ marginTop: "2rem", color: "var(--text-muted)" }}>
            Service areas: {site.serviceAreaSummary}
          </p>
        </div>
      </section>
    </>
  );
}
