import { NextResponse } from "next/server";
import { appendBooking, type BookingPhoto } from "@/lib/bookings";

export const runtime = "nodejs";

const LOCATION_TYPES = new Set(["dock", "home", "marina", "other"]);
const SERVICE_TYPES = new Set(["marine", "trailer", "both", "unsure"]);
const PHOTO_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);
const PHOTO_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"]);
const MAX_PHOTOS = 6;
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const MAX_TOTAL_PHOTO_SIZE = 20 * 1024 * 1024;

function required(value: unknown, label: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} is required`);
  }
  return value.trim();
}

function formValue(form: FormData, key: string): string | undefined {
  const value = form.get(key);
  return typeof value === "string" ? value : undefined;
}

function isFile(value: FormDataEntryValue): value is File {
  return (
    typeof value !== "string" &&
    typeof value.arrayBuffer === "function" &&
    typeof value.name === "string" &&
    typeof value.size === "number"
  );
}

function isAllowedPhoto(file: File): boolean {
  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  return PHOTO_TYPES.has(file.type.toLowerCase()) || (!file.type && PHOTO_EXTENSIONS.has(extension));
}

async function parsePhotos(form: FormData): Promise<BookingPhoto[]> {
  const entries = form.getAll("photos");
  if (entries.length > MAX_PHOTOS) {
    throw new Error(`You can attach no more than ${MAX_PHOTOS} photos`);
  }

  const files = entries.filter((entry): entry is File => isFile(entry) && entry.size > 0);
  if (files.length !== entries.length) {
    throw new Error("Invalid photo upload");
  }

  const totalSize = files.reduce((total, file) => total + file.size, 0);
  if (totalSize > MAX_TOTAL_PHOTO_SIZE) {
    throw new Error("Attached photos must be 20 MB or less in total");
  }

  const photos: BookingPhoto[] = [];
  for (const file of files) {
    if (!isAllowedPhoto(file)) {
      throw new Error("Photos must be JPG, PNG, WEBP, or HEIC files");
    }
    if (file.size > MAX_PHOTO_SIZE) {
      throw new Error("Each photo must be 5 MB or less");
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    photos.push({
      name: file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
      dataUrl: `data:${file.type || "application/octet-stream"};base64,${bytes.toString("base64")}`,
    });
  }
  return photos;
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const name = required(formValue(form, "name"), "Name");
    const phone = required(formValue(form, "phone"), "Phone");
    const email = required(formValue(form, "email"), "Email");
    const serviceType = required(formValue(form, "serviceType"), "Service type");
    const boatType = required(formValue(form, "boatType"), "Boat type");
    const locationDetail = required(formValue(form, "locationDetail"), "Location details");
    const problem = required(formValue(form, "problem"), "Problem description");
    const photos = await parsePhotos(form);

    const locationTypeRaw = required(formValue(form, "locationType"), "Location type");
    if (!LOCATION_TYPES.has(locationTypeRaw)) {
      return NextResponse.json({ error: "Invalid location type" }, { status: 400 });
    }

    if (!SERVICE_TYPES.has(serviceType)) {
      return NextResponse.json({ error: "Invalid service type" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Temporary MVP storage: data URLs keep photos associated with local bookings.json.
    // Production needs durable R2/S3 storage or email attachments instead.
    const entry = await appendBooking({
      name,
      phone,
      email,
      serviceType: serviceType as "marine" | "trailer" | "both" | "unsure",
      boatType,
      locationType: locationTypeRaw as "dock" | "home" | "marina" | "other",
      locationDetail,
      preferredDate: (formValue(form, "preferredDate") || "").trim(),
      preferredTime: (formValue(form, "preferredTime") || "").trim(),
      problem,
      photos,
    });

    // Email stub: wire Resend or Formspree — see README.
    // if (process.env.RESEND_API_KEY) { ... }

    return NextResponse.json({ ok: true, id: entry.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    const status = message.includes("required") || message.includes("photo") || message.includes("Photo") || message.includes("MB")
      ? 400
      : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
