"use client";

import { useState } from "react";
import Link from "next/link";
import ImageUpload from "@/components/ImageUpload";

const SENSITIVE_ZONES = [
  { id: "none", label: "Bukan zona sensitif" },
  { id: "pantai", label: "🌊 Dekat pantai (Segara Kerthi)" },
  { id: "sungai", label: "💧 Dekat sungai/sumber air (Danu Kerthi)" },
  { id: "suci", label: "🛕 Dekat tempat suci/pura" },
];

export default function LaporPage() {
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [zone, setZone] = useState("none");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  const handleGetLocation = () => {
    setGeoError(null);

    if (!navigator.geolocation) {
      setGeoError("Browser Anda tidak mendukung lokasi.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
      },
      () => {
        setGeoError("Izinkan akses lokasi untuk melaporkan.");
      }
    );
  };

  const handleSubmit = async () => {
    if (!photo) {
      setError("Foto diperlukan.");
      return;
    }

    if (lat == null || lng == null) {
      setError("Lokasi diperlukan.");
      return;
    }

    setLoading(true);
    setError(null);

    const fullDescription =
      zone !== "none"
        ? `[${SENSITIVE_ZONES.find((z) => z.id === zone)?.label}] ${
            description || ""
          }`
        : description || "";

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat,
          lng,
          description: fullDescription,
          photo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Gagal mengirim laporan.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Gagal terhubung ke server. Periksa koneksi internet Anda.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setPhoto(null);
    setDescription("");
    setLat(null);
    setLng(null);
    setZone("none");
    setError(null);
    setGeoError(null);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-green-700 mb-2">
          Laporan terkirim!
        </h1>
        <p className="text-gray-600 mb-6">
          Terima kasih atas kontribusi menjaga Bali tetap bersih.
        </p>
        <Link
          href="/laporan"
          className="inline-block px-6 py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
        >
          Lihat di Peta
        </Link>
        <button
          type="button"
          onClick={handleReset}
          className="block mx-auto mt-3 px-5 py-2 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
        >
          Lapor Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-green-700">Lapor Sampah Liar</h1>
        <p className="text-gray-600 mt-1 text-sm">
          Laporkan penumpukan sampah liar untuk membantu menjaga Bali.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-green-50 p-6 space-y-5">
        {/* Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto penumpukan sampah
          </label>
          <ImageUpload
            onChange={(base64) => setPhoto(base64)}
            onReset={() => setPhoto(null)}
            currentImage={photo}
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lokasi
          </label>
          <button
            type="button"
            onClick={handleGetLocation}
            className="w-full px-4 py-2.5 rounded-xl bg-green-50 text-green-700 font-medium hover:bg-green-100 transition-colors border border-green-200"
          >
            📍 Gunakan Lokasi Saya
          </button>
          {lat != null && lng != null && (
            <p className="text-green-600 text-sm mt-2">
              ✓ Lokasi terdeteksi: {lat.toFixed(4)}, {lng.toFixed(4)}
            </p>
          )}
          {geoError && (
            <p className="text-red-600 text-sm mt-2">{geoError}</p>
          )}
        </div>

        {/* Sensitive Zone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Zona sensitif (opsional)
          </label>
          <select
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            {SENSITIVE_ZONES.map((z) => (
              <option key={z.id} value={z.id}>
                {z.label}
              </option>
            ))}
          </select>
          <p className="text-gray-400 text-xs mt-1">
            Berdasarkan filosofi Sad Kerthi — menjaga kesucian pantai, sungai,
            dan tempat suci.
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Keterangan (opsional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Jelaskan kondisi penumpukan sampah..."
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-600 text-sm text-center">{error}</p>
        )}

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !photo || lat == null}
          className="w-full px-5 py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? "Mengirim..." : "Kirim Laporan"}
        </button>
      </div>
    </div>
  );
}
