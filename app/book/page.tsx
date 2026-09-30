import type { Metadata } from "next";
import BookingForm from "@/components/BookingForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book Service",
  description:
    "Request marine repair or mobile marine service from Snapper Marine, LLC.",
};

export default function BookPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Schedule</span>
          <h1>Request service</h1>
          <p>
            Fill out the form below. We&apos;ll review your request and follow up
            to confirm timing. Prefer to talk? Call{" "}
            <a href={site.phoneHref}>{site.phoneDisplay}</a>.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <BookingForm />
        </div>
      </section>
    </>
  );
}
