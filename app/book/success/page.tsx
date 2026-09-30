import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request received",
  robots: { index: false },
};

export default function BookSuccessPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const id = searchParams.id;

  return (
    <section className="section">
      <div className="container">
        <div className="success-box">
          <div className="check" aria-hidden>
            ✓
          </div>
          <h1 style={{ color: "var(--chrome-bright)", margin: "0 0 0.75rem" }}>
            Request received
          </h1>
          <p style={{ color: "var(--text-muted)", margin: "0 0 1.5rem" }}>
            Thanks for contacting {site.shortName}. We&apos;ll review your service
            request and follow up soon.
            {id ? (
              <>
                <br />
                <span style={{ fontSize: "0.85rem", color: "var(--chrome-dim)" }}>
                  Reference: {id}
                </span>
              </>
            ) : null}
          </p>
          <div className="cta-row" style={{ justifyContent: "center" }}>
            <a href={site.phoneHref} className="btn btn-primary">
              Call {site.phoneDisplay}
            </a>
            <Link href="/" className="btn btn-ghost">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
