"use client";

import { useRef, useState } from "react";

interface ImageUploadProps {
  onChange: (base64: string) => void;
  onReset: () => void;
  currentImage: string | null;
}

async function resizeImage(file: File): Promise<string> {
  const { promise, resolve, reject } = Promise.withResolvers<string>();
  const reader = new FileReader();

  reader.onload = (e) => {
    const img = new Image();

    img.onload = () => {
      const MAX_SIZE = 1024;
      let { width, height } = img;

      if (width > height && width > MAX_SIZE) {
        height = Math.round((height * MAX_SIZE) / width);
        width = MAX_SIZE;
      } else if (height > MAX_SIZE) {
        width = Math.round((width * MAX_SIZE) / height);
        height = MAX_SIZE;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context tidak tersedia."));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };

    img.onerror = () => reject(new Error("Gagal memuat gambar."));
    img.src = e.target?.result as string;
  };

  reader.onerror = () => reject(new Error("Gagal membaca file."));
  reader.readAsDataURL(file);
  return promise;
}

export default function ImageUpload({
  onChange,
  onReset,
  currentImage,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setProcessing(true);

    try {
      const base64 = await resizeImage(file);
      onChange(base64);
    } catch {
      // Silently fail; the caller shows no preview
    } finally {
      setProcessing(false);
      // Reset input so selecting the same file again triggers change
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  if (currentImage) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-full max-w-sm">
          <img
            src={currentImage}
            alt="Foto sampah yang dipilih"
            className="w-full rounded-2xl border-4 border-green-100 object-cover"
          />
        </div>
        <button
          type="button"
          onClick={onReset}
          className="px-5 py-2.5 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
        >
          Ambil Foto Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
        id="image-upload-input"
      />
      <label
        htmlFor="image-upload-input"
        className={`flex flex-col items-center justify-center gap-3 w-full max-w-sm min-h-[200px] rounded-2xl border-2 border-dashed border-green-300 bg-green-50 cursor-pointer transition-colors hover:bg-green-100 ${
          processing ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        {processing ? (
          <>
            <div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-green-700 font-medium">
              Memproses gambar...
            </span>
          </>
        ) : (
          <>
            <span className="text-5xl">📷</span>
            <span className="text-green-700 font-semibold text-lg">
              Ambil Foto Sampah
            </span>
            <span className="text-gray-500 text-sm text-center px-4">
              Klik untuk membuka kamera atau pilih dari galeri
            </span>
          </>
        )}
      </label>
    </div>
  );
}
