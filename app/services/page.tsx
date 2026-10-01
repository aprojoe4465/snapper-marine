import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { boatServices } from "@/lib/boats";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Mobile marine services from Snapper Marine, LLC — on-site engines, electrical, diagnostics, and more at your dock, marina, or home.",
};

const mobileServices = [
  {
    title: "Engine diagnostics & repair",
    body: "Outboard and inboard troubleshooting, tune-ups, and mechanical repairs on-site.",
  },
  {
    title: "Electrical systems",
    body: "Battery banks, charging systems, wiring, and electronics support where your boat is.",
  },
  {
    title: "Routine maintenance",
    body: "Seasonal service, fluid changes, impeller work, and preventive care at your location.",
  },
  {
    title: "Systems & accessories",
    body: "Pumps, bilge, steering, and general marine systems repair — dockside or at home.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">What we offer</span>
          <h1>Mobile marine services</h1>
          <p>
            Professional workmanship for powerboats and recreational vessels —
            including center-console fishing boats — delivered on-site at your
            dock, marina, or home.
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
              <h2>On-site service</h2>
              <p>
                We come to you for diagnostics, maintenance, and repairs. Service
                list below is a starting point — ask if you need something not
                listed.
              </p>
            </div>
            <div className="card-grid">
              {mobileServices.map((s) => (
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
            <h2>How mobile service works</h2>
            <p>
              Prefer more detail on locations and process? See our{" "}
              <Link href="/mobile-marine">mobile marine</Link> page for on-site
              coverage and how a visit works.
            </p>
          </div>
          <div className="cta-row">
            <Link href="/book" className="btn btn-primary">
              Book on-site service
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
