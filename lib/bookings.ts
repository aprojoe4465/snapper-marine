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
  const list = await readBookings();
  const entry: BookingRequest = {
    ...booking,
    id: `bk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  list.push(entry);
  await fs.mkdir(path.dirname(dataPath), { recursive: true });
  await fs.writeFile(dataPath, JSON.stringify(list, null, 2), "utf8");
  return entry;
}
