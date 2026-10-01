"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

type FormState = {
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  boatType: string;
  locationType: string;
  locationDetail: string;
  preferredDate: string;
  preferredTime: string;
  problem: string;
};

const initial: FormState = {
  name: "",
  phone: "",
  email: "",
  serviceType: "marine",
  boatType: "",
  locationType: "marina",
  locationDetail: "",
  preferredDate: "",
  preferredTime: "",
  problem: "",
};

export default function BookingForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initial);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Could not submit request. Please try again or call us.");
      }
      router.push(`/book/success?id=${encodeURIComponent(data.id || "")}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="form-row two">
        <label>
          Full name *
          <input
            required
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Jane Doe"
          />
        </label>
        <label>
          Phone *
          <input
            required
            type="tel"
            name="phone"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="(954) 555-1234"
          />
        </label>
      </div>

      <label>
        Email *
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="you@example.com"
        />
      </label>

      <label>
        Service type *
        <select
          required
          name="serviceType"
          value={form.serviceType}
          onChange={(e) => update("serviceType", e.target.value)}
        >
          <option value="marine">Boat / marine service</option>
          <option value="trailer">Boat trailer repair</option>
          <option value="both">Boat and trailer service</option>
          <option value="unsure">Not sure — help me choose</option>
        </select>
      </label>

      <label>
        Boat / trailer type / make *
        <input
          required
          name="boatType"
          value={form.boatType}
          onChange={(e) => update("boatType", e.target.value)}
          placeholder="e.g. 24' center console, Yamaha F150, tandem trailer"
        />
      </label>

      <div className="form-row two">
        <label>
          Location type *
          <select
            required
            name="locationType"
            value={form.locationType}
            onChange={(e) => update("locationType", e.target.value)}
          >
            <option value="dock">Dock / slip</option>
            <option value="home">Home / trailer</option>
            <option value="marina">Marina</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Location details *
          <input
            required
            name="locationDetail"
            value={form.locationDetail}
            onChange={(e) => update("locationDetail", e.target.value)}
            placeholder="Marina name, address, or city"
          />
        </label>
      </div>

      <div className="form-row two">
        <label>
          Preferred date
          <input
            type="date"
            name="preferredDate"
            value={form.preferredDate}
            onChange={(e) => update("preferredDate", e.target.value)}
          />
        </label>
        <label>
          Preferred time
          <input
            type="time"
            name="preferredTime"
            value={form.preferredTime}
            onChange={(e) => update("preferredTime", e.target.value)}
          />
        </label>
      </div>

      <label>
        Problem / service needed *
        <textarea
          required
          name="problem"
          value={form.problem}
          onChange={(e) => update("problem", e.target.value)}
          placeholder="Describe the issue, symptoms, or work you need…"
        />
        <span className="form-hint">
          Photo upload coming later — for now, describe the issue or text/email photos after booking.
        </span>
      </label>

      {error && <p className="form-error" role="alert">{error}</p>}

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? "Sending…" : "Submit service request"}
      </button>
    </form>
  );
}
