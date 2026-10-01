import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { boatGallery, boatHero } from "@/lib/boats";

export default function HomePage() {
  return (
    <>
      <section className="hero hero-with-photo">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Florida marine repair</span>
            <h1>
              Expert boat repair &amp;{" "}
              <span>mobile marine</span> service
            </h1>
            <p className="lead">
              {site.name} keeps you on the water — shop-quality repairs and
              on-site mobile service across Coral Springs, Port St. Lucie, and
              South Florida. We work on center-console fishing boats and other
              powerboats.
            </p>
            <div className="cta-row">
              <Link href="/book" className="btn btn-primary">
                Book service
              </Link>
              <a href={site.phoneHref} className="btn btn-chrome">
                Call {site.phoneDisplay}
              </a>
              <Link href="/services" className="btn btn-ghost">
                View services
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <figure className="hero-photo">
              <Image
                src={boatHero.src}
                alt={boatHero.alt}
                width={boatHero.width}
                height={boatHero.height}
                priority
                className="hero-photo-img"
              />
              <figcaption className="photo-credit">
                {boatHero.caption} {boatHero.credit}
              </figcaption>
            </figure>
            <Image
              className="hero-logo hero-logo-badge"
              src="/logo.png"
              alt="Snapper Marine, LLC logo"
              width={200}
              height={112}
            />
          </div>
        </div>
      </section>

      <section className="section section-alt" id="boats">
        <div className="container">
          <div className="section-head">
            <h2>Center-console fishing boats</h2>
            <p>
              Illustrative photos of center-console sport fishing boats — the
              style many of our South Florida customers run. These are free-license
              style references, not official Contender (or other brand) product
              photos, and Snapper Marine does not sell boats.
            </p>
          </div>
          <div className="boat-gallery">
            {boatGallery.map((img) => (
              <figure key={img.src} className="boat-card">
                <div className="boat-card-frame">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    className="boat-card-img"
                  />
                </div>
                <figcaption>
                  <span className="boat-card-caption">{img.caption}</span>
                  <span className="photo-credit">{img.credit}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>What we do</h2>
            <p>
              From routine maintenance to diagnostics and repairs — in the shop
              or at your dock, marina, or home.
            </p>
          </div>
          <div className="card-grid">
            <article className="card">
              <div className="icon">⚙</div>
              <h3>Repair shop</h3>
              <p>
                Engine work, electrical, systems diagnostics, and full-service
                marine repair you can trust.
              </p>
            </article>
            <article className="card">
              <div className="icon">🚤</div>
              <h3>Mobile marine</h3>
              <p>
                We come to you — dockside, marina, or trailer — for convenient
                on-site service across South Florida.
              </p>
            </article>
            <article className="card">
              <div className="icon">📅</div>
              <h3>Easy booking</h3>
              <p>
                Request service online in minutes. Tell us about your boat and
                we&apos;ll follow up to confirm.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <h2>Ready to get back on the water?</h2>
            <p>
              Call us or submit a service request — we&apos;ll confirm timing and
              next steps.
            </p>
          </div>
          <div className="cta-row">
            <Link href="/book" className="btn btn-primary">
              Request service
            </Link>
            <a href={site.phoneHref} className="btn btn-ghost">
              {site.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
