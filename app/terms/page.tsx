import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of Service for ${site.name}.`,
};

export default function TermsPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Service terms</span>
          <h1>Terms of Service</h1>
          <p>Practical terms for mobile marine service from {site.name}.</p>
        </div>
      </div>

      <section className="section">
        <div className="container prose" style={{ maxWidth: 720 }}>
          <h2>Estimates and service</h2>
          <p>
            Estimates are based on the information available and, when applicable,
            an inspection. They are not guarantees of the final cost, time, or
            outcome. Additional work will be discussed as needed before it is
            performed.
          </p>

          <h2>Scheduling and travel</h2>
          <p>
            Appointments depend on availability, weather, location, and safe access
            to the vessel. Any applicable travel fees will be communicated before
            service is scheduled.
          </p>

          <h2>Payment</h2>
          <p>
            Payment is due according to the terms agreed for the service. Customers
            are responsible for approved work, parts, travel fees, and other charges
            disclosed during scheduling or service.
          </p>

          <h2>Customer responsibilities</h2>
          <p>
            Please provide accurate boat, location, and contact information and make
            sure we have timely access to the vessel and a reasonably safe workspace.
            You are responsible for removing or protecting personal belongings before
            work begins.
          </p>

          <h2>Marine work and liability</h2>
          <p>
            Marine systems and vessels can have hidden conditions and existing wear.
            While we use reasonable care and professional practices, {site.name} is
            not responsible for pre-existing conditions, concealed defects, or
            damage outside the agreed scope of work. To the extent permitted by law,
            liability for a service is limited to the amount paid for that service,
            and we are not liable for indirect or consequential losses.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms? Contact {site.name} at{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a> or{" "}
            <a href={site.phoneHref}>{site.phoneDisplay}</a>.
          </p>
        </div>
      </section>
    </>
  );
}
