"use client";

import type { ClassificationResult as Result } from "@/types/waste";
import { getCategoryById } from "@/lib/waste-categories";

interface ClassificationResultProps {
  result: Result;
  onReset: () => void;
}

const CONFIDENCE_LABELS: Record<string, string> = {
  high: "Tingkat keyakinan: Tinggi",
  medium: "Tingkat keyakinan: Sedang",
  low: "Tingkat keyakinan: Rendah",
};

export default function ClassificationResult({
  result,
  onReset,
}: ClassificationResultProps) {
  const category = getCategoryById(result.category);
  const color = category?.color ?? "#9E9E9E";
  const icon = category?.icon ?? "❓";
  const isNone = result.category === "none";

  return (
    <div className="flex flex-col gap-5 w-full max-w-md mx-auto">
      {/* Category Badge */}
      <div className="flex items-center justify-center">
        <span
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-bold text-lg shadow-md"
          style={{ backgroundColor: color }}
        >
          <span>{icon}</span>
          {result.categoryName}
        </span>
      </div>

      {/* Detected Item */}
      <div className="text-center">
        <p className="text-gray-500 text-sm">Item terdeteksi</p>
        <p className="text-xl font-semibold text-gray-800">
          {result.itemName}
        </p>
      </div>

      {/* Recyclable Indicator */}
      {!isNone && (
        <div className="flex items-center justify-center gap-2">
          {result.recyclable ? (
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-green-100 text-green-700 font-medium text-sm">
              ✅ Bisa Daur Ulang
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-100 text-red-700 font-medium text-sm">
              ❌ Tidak Daur Ulang
            </span>
          )}
        </div>
      )}

      {/* Disposal Instructions */}
      <div
        className="rounded-xl border-l-4 p-4 bg-gray-50"
        style={{ borderLeftColor: color }}
      >
        <h3 className="font-semibold text-gray-800 mb-1.5">
          Cara Pembuangan
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {result.disposalInstructions}
        </p>
      </div>

      {/* Eco Tip */}
      {result.ecoTip && (
        <div className="rounded-xl bg-green-50 p-4">
          <h3 className="font-semibold text-green-800 mb-1.5 flex items-center gap-1.5">
            🌿 Tips Ramah Lingkungan
          </h3>
          <p className="text-green-700 text-sm leading-relaxed">
            {result.ecoTip}
          </p>
        </div>
      )}

      {/* Confidence */}
      <p className="text-center text-gray-400 text-xs">
        {CONFIDENCE_LABELS[result.confidence] ?? CONFIDENCE_LABELS.low}
      </p>

      {/* Reset Button */}
      <button
        type="button"
        onClick={onReset}
        className="w-full px-5 py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
      >
        Klasifikasi Lagi
      </button>
    </div>
  );
}
