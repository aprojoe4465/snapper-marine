"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
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

type SelectedPhoto = {
  file: File;
  preview: string;
};

const MAX_PHOTOS = 5;
const MAX_PHOTO_SIZE = 700 * 1024;
const MAX_TOTAL_PHOTO_SIZE = 3 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1400;
const PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const PHOTO_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

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

function isAllowedPhoto(file: File) {
  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  return PHOTO_TYPES.has(file.type.toLowerCase()) || (!file.type && PHOTO_EXTENSIONS.has(extension));
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const source = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(source);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(source);
      reject(new Error("This image could not be read. Choose a JPG, PNG, or WEBP photo."));
    };
    image.src = source;
  });
}

function canvasBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not optimize this photo."))),
      "image/jpeg",
      quality,
    );
  });
}

async function optimizePhoto(file: File): Promise<File> {
  const image = await loadImage(file);
  const largestSide = Math.max(image.naturalWidth, image.naturalHeight);
  const scale = Math.min(1, MAX_IMAGE_DIMENSION / largestSide);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not optimize this photo.");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  let blob: Blob | null = null;
  for (const quality of [0.82, 0.7, 0.58, 0.46]) {
    blob = await canvasBlob(canvas, quality);
    if (blob.size <= MAX_PHOTO_SIZE) break;
  }
  if (!blob || blob.size > MAX_PHOTO_SIZE) {
    throw new Error("This photo is too detailed to fit the 700 KB upload limit. Choose a smaller photo.");
  }

  const baseName = file.name.replace(/\.[^/.]+$/, "") || "service-photo";
  return new File([blob], `${baseName}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

export default function BookingForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initial);
  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const photosRef = useRef<SelectedPhoto[]>([]);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    return () => {
      photosRef.current.forEach(({ preview }) => URL.revokeObjectURL(preview));
    };
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onPhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    setPhotoError(null);

    if (!files.length) return;
    if (photos.length + files.length > MAX_PHOTOS) {
      setPhotoError(`Please select no more than ${MAX_PHOTOS} photos.`);
      return;
    }

    const invalidType = files.find((file) => !isAllowedPhoto(file));
    if (invalidType) {
      setPhotoError("Photos must be JPG, PNG, or WEBP files.");
      return;
    }

    setOptimizing(true);
    try {
      const optimized = await Promise.all(files.map(optimizePhoto));
      const existingBytes = photos.reduce((total, photo) => total + photo.file.size, 0);
      const newBytes = optimized.reduce((total, file) => total + file.size, 0);
      if (existingBytes + newBytes > MAX_TOTAL_PHOTO_SIZE) {
        setPhotoError("Selected photos exceed the 3 MB total upload limit. Remove a photo or choose smaller images.");
        return;
      }

      setPhotos((current) => [
        ...current,
        ...optimized.map((file) => ({ file, preview: URL.createObjectURL(file) })),
      ]);
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : "Could not optimize this photo.");
    } finally {
      setOptimizing(false);
    }
  }

  function removePhoto(index: number) {
    setPhotos((current) => {
      const removed = current[index];
      if (removed) URL.revokeObjectURL(removed.preview);
      return current.filter((_, photoIndex) => photoIndex !== index);
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      photos.forEach(({ file }) => payload.append("photos", file, file.name));

      const res = await fetch("/api/book", {
        method: "POST",
        body: payload,
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
            placeholder="(772) 555-1234"
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
      </label>

      <div className="photo-upload">
        <label htmlFor="service-photos">Photos (optional)</label>
        <input
          id="service-photos"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={onPhotoChange}
          disabled={photos.length >= MAX_PHOTOS || submitting || optimizing}
        />
        <span className="form-hint">
          Images are resized automatically. Add up to {MAX_PHOTOS} photos, 700 KB each, with a 3 MB total limit to keep the request under Vercel's upload limit.
        </span>
        {photoError && <span className="form-error" role="alert">{photoError}</span>}
        {photos.length > 0 && (
          <div className="photo-previews" aria-label="Selected photos">
            {photos.map((photo, index) => (
              <div className="photo-preview" key={`${photo.file.name}-${photo.file.lastModified}-${index}`}>
                <img src={photo.preview} alt={`Selected boat photo ${index + 1}`} />
                <button
                  type="button"
                  className="photo-remove"
                  onClick={() => removePhoto(index)}
                  aria-label={`Remove ${photo.file.name}`}
                  disabled={submitting || optimizing}
                >
                  Remove
                </button>
                <span title={photo.file.name}>{photo.file.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      <button type="submit" className="btn btn-primary" disabled={submitting || optimizing}>
        {optimizing ? "Optimizing photos…" : submitting ? "Sending…" : "Submit service request"}
      </button>
    </form>
  );
}
