import { promises as fs } from "fs";
import path from "path";

export type BookingPhoto = {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
};

export type BookingRequest = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  serviceType: "marine" | "trailer" | "both" | "unsure";
  boatType: string;
  locationType: "dock" | "home" | "marina" | "other";
  locationDetail: string;
  preferredDate: string;
  preferredTime: string;
  problem: string;
  photos: BookingPhoto[];
};

const dataPath = path.join(process.cwd(), "data", "bookings.json");

export async function readBookings(): Promise<BookingRequest[]> {
  try {
    const raw = await fs.readFile(dataPath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function appendBooking(
  booking: Omit<BookingRequest, "id" | "createdAt">
): Promise<BookingRequest> {
  const entry: BookingRequest = {
    ...booking,
    id: `bk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };

  // Vercel's deployed filesystem is read-only and ephemeral; Resend is the
  // production persistence path. Keep the JSON write for local development only.
  if (process.env.VERCEL) {
    console.info(`[booking] Skipping local file write on Vercel for ${entry.id}`);
    return entry;
  }

  try {
    const list = await readBookings();
    list.push(entry);
    await fs.mkdir(path.dirname(dataPath), { recursive: true });
    await fs.writeFile(dataPath, JSON.stringify(list, null, 2), "utf8");
  } catch (error) {
    // A local permission or filesystem error must not prevent email notification.
    console.warn(`[booking] Could not write ${dataPath}; continuing with email`, error);
  }

  return entry;
}
