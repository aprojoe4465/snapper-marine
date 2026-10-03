import { NextResponse } from "next/server";
import { Resend } from "resend";
import { appendBooking, type BookingPhoto, type BookingRequest } from "@/lib/bookings";
import { site } from "@/lib/site";

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
const MAX_PHOTOS = 5;
const MAX_PHOTO_SIZE = 800 * 1024;
// Keep multipart requests well below Vercel Hobby's approximately 4.5 MB body limit.
const MAX_TOTAL_PHOTO_SIZE = 3 * 1024 * 1024;

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
    throw new Error("Attached photos must be 3 MB or less in total");
  }

  const photos: BookingPhoto[] = [];
  for (const file of files) {
    if (!isAllowedPhoto(file)) {
      throw new Error("Photos must be JPG, PNG, or WEBP files");
    }
    if (file.size > MAX_PHOTO_SIZE) {
      throw new Error("Each photo must be 800 KB or less after compression");
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

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

function safeFilename(name: string, index: number): string {
  const cleaned = name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100);
  return cleaned || `service-photo-${index + 1}`;
}

function describeResendError(error: unknown): string {
  try {
    if (error instanceof Error) {
      const details = error as Error & { statusCode?: unknown; body?: unknown };
      return JSON.stringify({
        name: details.name,
        message: details.message,
        statusCode: details.statusCode,
        body: details.body,
      });
    }
    const serialized = JSON.stringify(error);
    return serialized || String(error);
  } catch {
    return String(error);
  }
}

function photoAttachments(photos: BookingPhoto[]) {
  return photos.flatMap((photo, index) => {
    const match = photo.dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) {
      console.warn(`[booking] Skipping invalid photo data for ${photo.name}`);
      return [];
    }
    return [{
      filename: safeFilename(photo.name, index),
      content: Buffer.from(match[2], "base64"),
      contentType: match[1],
    }];
  });
}

function bookingEmailText(entry: BookingRequest): string {
  return [
    "New Snapper Marine service request",
    `Booking ID: ${entry.id}`,
    `Received: ${entry.createdAt}`,
    "",
    `Name: ${entry.name}`,
    `Phone: ${entry.phone}`,
    `Email: ${entry.email}`,
    `Service: ${entry.serviceType}`,
    `Boat / trailer: ${entry.boatType}`,
    `Location: ${entry.locationType} — ${entry.locationDetail}`,
    `Preferred date: ${entry.preferredDate || "Not specified"}`,
    `Preferred time: ${entry.preferredTime || "Not specified"}`,
    `Photos attached: ${entry.photos.length}`,
    "",
    "Problem / service needed:",
    entry.problem,
  ].join("\n");
}

function bookingEmailHtml(entry: BookingRequest): string {
  const row = (label: string, value: string) =>
    `<tr><th align="left" style="padding:6px 12px 6px 0;vertical-align:top">${escapeHtml(label)}</th><td style="padding:6px 0">${escapeHtml(value)}</td></tr>`;
  return `<!doctype html>
<html><body style="font-family:Arial,sans-serif;color:#1b1b22">
  <h2>New Snapper Marine service request</h2>
  <p><strong>Booking ID:</strong> ${escapeHtml(entry.id)}</p>
  <table>${row("Name", entry.name)}${row("Phone", entry.phone)}${row("Email", entry.email)}${row("Service", entry.serviceType)}${row("Boat / trailer", entry.boatType)}${row("Location", `${entry.locationType} — ${entry.locationDetail}`)}${row("Preferred date", entry.preferredDate || "Not specified")}${row("Preferred time", entry.preferredTime || "Not specified")}${row("Photos", `${entry.photos.length} attached`)}</table>
  <h3>Problem / service needed</h3>
  <p>${escapeHtml(entry.problem).replace(/\n/g, "<br />")}</p>
</body></html>`;
}

async function notifyByEmail(entry: BookingRequest): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info(`[booking] RESEND_API_KEY is not set; email skipped for ${entry.id}`);
    return;
  }

  try {
    const resend = new Resend(apiKey);
    const from = process.env.RESEND_FROM || "Snapper Marine <onboarding@resend.dev>";
    const result = await resend.emails.send({
      from,
      to: [site.email],
      subject: `New Snapper Marine service request — ${entry.name}`,
      text: bookingEmailText(entry),
      html: bookingEmailHtml(entry),
      attachments: photoAttachments(entry.photos),
    });

    if (result.error) {
      console.error(`[booking] Resend failed for ${entry.id}: ${describeResendError(result.error)}`);
      return;
    }
    console.info(`[booking] Email sent for ${entry.id}: ${result.data?.id || "accepted"}`);
  } catch (error) {
    console.error(`[booking] Email notification failed for ${entry.id}: ${describeResendError(error)}`);
  }
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

    await notifyByEmail(entry);

    return NextResponse.json({ ok: true, id: entry.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    const status = message.includes("required") || message.includes("photo") || message.includes("Photo") || message.includes("MB")
      ? 400
      : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
