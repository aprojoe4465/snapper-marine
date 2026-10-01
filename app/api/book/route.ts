import { NextResponse } from "next/server";
import { appendBooking } from "@/lib/bookings";

export const runtime = "nodejs";

type Body = {
  name?: string;
  phone?: string;
  email?: string;
  serviceType?: string;
  boatType?: string;
  locationType?: string;
  locationDetail?: string;
  preferredDate?: string;
  preferredTime?: string;
  problem?: string;
};

const LOCATION_TYPES = new Set(["dock", "home", "marina", "other"]);
const SERVICE_TYPES = new Set(["marine", "trailer", "both", "unsure"]);

function required(value: unknown, label: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} is required`);
  }
  return value.trim();
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    const name = required(body.name, "Name");
    const phone = required(body.phone, "Phone");
    const email = required(body.email, "Email");
    const serviceType = required(body.serviceType, "Service type");
    const boatType = required(body.boatType, "Boat type");
    const locationDetail = required(body.locationDetail, "Location details");
    const problem = required(body.problem, "Problem description");

    const locationTypeRaw = required(body.locationType, "Location type");
    if (!LOCATION_TYPES.has(locationTypeRaw)) {
      return NextResponse.json(
        { error: "Invalid location type" },
        { status: 400 }
      );
    }

    if (!SERVICE_TYPES.has(serviceType)) {
      return NextResponse.json(
        { error: "Invalid service type" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const entry = await appendBooking({
      name,
      phone,
      email,
      serviceType: serviceType as "marine" | "trailer" | "both" | "unsure",
      boatType,
      locationType: locationTypeRaw as "dock" | "home" | "marina" | "other",
      locationDetail,
      preferredDate: (body.preferredDate || "").trim(),
      preferredTime: (body.preferredTime || "").trim(),
      problem,
    });

    // Email stub: wire Resend or Formspree — see README.
    // if (process.env.RESEND_API_KEY) { ... }

    return NextResponse.json({ ok: true, id: entry.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    const status = message.includes("required") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
