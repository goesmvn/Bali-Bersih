export type WasteCategory = {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  disposalInstructions: string;
  recyclable: boolean;
};

export const wasteCategories: WasteCategory[] = [
  {
    id: "organik",
    name: "Organik",
    color: "#4CAF50",
    icon: "🌱",
    description: "Sisa makanan, dedaunan, dan bahan biodegradable lainnya.",
    disposalInstructions:
      "Pisahkan dari sampah lain dan olah menjadi kompos di rumah atau kumpulkan di tempat pengolahan kompos banjar/RT.",
    recyclable: false,
  },
  {
    id: "plastik",
    name: "Plastik Daur Ulang",
    color: "#2196F3",
    icon: "♻️",
    description: "Botol plastik, kantong, kemasan plastik, dan wadah plastik.",
    disposalInstructions:
      "Bersihkan dari sisa makanan, kumpulkan, dan bawa ke bank sampah atau tempat daur ulang terdekat di Bali.",
    recyclable: true,
  },
  {
    id: "kertas",
    name: "Kertas & Kardus",
    color: "#FF9800",
    icon: "📄",
    description: "Kertas, kardus, karton, dan kemasan berbahan kertas.",
    disposalInstructions:
      "Pisahkan berdasarkan jenis (kardus/kertas), kumpulkan, dan bawa ke bank sampah atau pengepul kertas.",
    recyclable: true,
  },
  {
    id: "logam_kaca",
    name: "Logam & Kaca",
    color: "#9C27B0",
    icon: "🥫",
    description: "Kaleng minuman, botol kaca, dan logam lainnya.",
    disposalInstructions:
      "Bersihkan dan pisahkan dari bahan lain, lalu bawa ke bank sampah atau pengepul logam dan kaca.",
    recyclable: true,
  },
  {
    id: "b3",
    name: "B3 (Berbahaya)",
    color: "#F44336",
    icon: "⚠️",
    description:
      "Baterai, bahan kimia, elektronik, lampu, dan Bahan Berbahaya dan Beracun lainnya.",
    disposalInstructions:
      "JANGAN dibuang ke tempat sampah biasa. Kumpulkan dan serahkan ke tempat pengelolaan B3 khusus atau titik drop-off elektronik.",
    recyclable: false,
  },
  {
    id: "residu",
    name: "Residu",
    color: "#607D8B",
    icon: "🗑️",
    description: "Sampah yang tidak dapat didaur ulang atau diolah secara biologis.",
    disposalInstructions:
      "Buang ke tempat sampah residu dan serahkan ke TPS (Tempat Pembuangan Sementara) setempat untuk pembuangan akhir.",
    recyclable: false,
  },
];

export function getCategoryById(id: string): WasteCategory | undefined {
  return wasteCategories.find((cat) => cat.id === id);
}
