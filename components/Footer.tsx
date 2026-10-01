import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h4>{site.name}</h4>
            <p>{site.tagline}</p>
            <p style={{ marginTop: "0.75rem" }}>
              Serving {site.serviceAreaSummary}
              <br />
              <span className="note" style={{ marginTop: "0.5rem" }}>
                Travel availability depends on location and scheduling
              </span>
            </p>
          </div>
          <div>
            <h4>Quick links</h4>
            <div className="footer-links">
              <Link href="/services">Services</Link>
              <Link href="/mobile-marine">Mobile Marine</Link>
              <Link href="/service-area">Service Area</Link>
              <Link href="/book">Book Service</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/privacy">Privacy Policy</Link>
            </div>
          </div>
          <div>
            <h4>Contact</h4>
            <div className="footer-links">
              <a href={site.phoneHref}>{site.phoneDisplay}</a>
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <Link href="/book" className="btn btn-primary" style={{ marginTop: "0.75rem", width: "fit-content" }}>
                Request service
              </Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {year} {site.name}. All rights reserved.
          </span>
          <span>{site.domain}</span>
        </div>
      </div>
    </footer>
  );
}
