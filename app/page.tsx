"use client";

import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import ClassificationResult from "@/components/ClassificationResult";
import type { ClassificationResult as Result } from "@/types/waste";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = async (base64: string) => {
    setImage(base64);
    setResult(null);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Terjadi kesalahan. Silakan coba lagi.");
        return;
      }

      setResult(data.data);
    } catch {
      setError("Gagal terhubung ke server. Periksa koneksi internet Anda.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setResult(null);
    setError(null);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-700 flex items-center justify-center gap-2">
          <span>🌴</span> Bali Bersih
        </h1>
        <p className="text-gray-600 mt-2">
          Sortir sampah dengan AI — foto sampah, dapatkan panduan pembuangan
          yang tepat.
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-green-50 p-6">
        {error && !loading && (
          <div className="flex flex-col items-center gap-4">
            <ImageUpload
              onChange={handleImageChange}
              onReset={handleReset}
              currentImage={image}
            />
            <div className="text-center">
              <p className="text-red-600 font-medium">{error}</p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-3 px-5 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )}{" "}
        {loading && (
          <div className="flex flex-col items-center gap-4 py-8">
            {image && (
              <img
                src={image}
                alt="Foto sampah yang dianalisis"
                className="w-full max-w-sm rounded-2xl border-4 border-green-100 object-cover opacity-70"
              />
            )}
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600 font-medium">Menganalisis gambar...</p>
          </div>
        )}{" "}
        {result && !loading && (
          <div className="flex flex-col gap-4">
            {image && (
              <img
                src={image}
                alt="Foto sampah yang diklasifikasi"
                className="w-full max-w-sm rounded-2xl border-4 border-green-100 object-cover mx-auto"
              />
            )}
            <ClassificationResult result={result} onReset={handleReset} />
          </div>
        )}{" "}
        {!result && !loading && !error && (
          <ImageUpload
            onChange={handleImageChange}
            onReset={handleReset}
            currentImage={image}
          />
        )}
      </div>

      {/* Info */}
      <div className="mt-6 text-center">
        <p className="text-gray-500 text-sm">
          💡 AI akan menganalisis foto Anda dan mengklasifikasikan sampah ke
          dalam 6 kategori yang relevan untuk Bali.
        </p>
      </div>
    </div>
  );
}
