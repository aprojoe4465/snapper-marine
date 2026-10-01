import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { boatServices } from "@/lib/boats";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Marine repair shop and mobile marine services from Snapper Marine, LLC — engines, electrical, diagnostics, and more.",
};

const shopServices = [
  {
    title: "Engine diagnostics & repair",
    body: "Outboard and inboard troubleshooting, tune-ups, and mechanical repairs.",
  },
  {
    title: "Electrical systems",
    body: "Battery banks, charging systems, wiring, and electronics support.",
  },
  {
    title: "Routine maintenance",
    body: "Seasonal service, fluid changes, impeller work, and preventive care.",
  },
  {
    title: "Systems & accessories",
    body: "Pumps, bilge, steering, and general marine systems repair.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">What we offer</span>
          <h1>Marine repair services</h1>
          <p>
            Shop-quality workmanship for powerboats and recreational vessels —
            including center-console fishing boats — plus mobile service when you
            need us on-site.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container services-spotlight">
          <figure className="services-photo">
            <Image
              src={boatServices.src}
              alt={boatServices.alt}
              width={boatServices.width}
              height={boatServices.height}
              className="services-photo-img"
            />
            <figcaption className="photo-credit">
              {boatServices.caption} {boatServices.credit}
            </figcaption>
          </figure>
          <div>
            <div className="section-head">
              <h2>Repair shop</h2>
              <p>
                Bring your boat in for diagnostics and repairs. Service list below
                is a starting point — ask if you need something not listed.
              </p>
            </div>
            <div className="card-grid">
              {shopServices.map((s) => (
                <article key={s.title} className="card">
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <h2>Mobile marine</h2>
            <p>
              Prefer we come to you? See our{" "}
              <Link href="/mobile-marine">mobile marine</Link> page for on-site
              service details and coverage.
            </p>
          </div>
          <div className="cta-row">
            <Link href="/book" className="btn btn-primary">
              Book service
            </Link>
            <a href={site.phoneHref} className="btn btn-ghost">
              Call {site.phoneDisplay}
            </a>
            <Link href="/mobile-marine" className="btn btn-ghost">
              Mobile marine details
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
