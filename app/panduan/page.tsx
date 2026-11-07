import { wasteCategories } from "@/lib/waste-categories";

export default function PanduanPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-700">Panduan Sampah</h1>
        <p className="text-gray-600 mt-2">
          6 kategori sampah yang relevan untuk pengelolaan sampah di Bali.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {wasteCategories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-2xl bg-white shadow-sm border-t-4 p-5"
            style={{ borderTopColor: cat.color }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{cat.icon}</span>
              <h2 className="font-bold text-lg text-gray-800">{cat.name}</h2>
            </div>
            <p className="text-gray-600 text-sm mb-3">{cat.description}</p>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-gray-700 text-sm">
                <span className="font-semibold">Cara pembuangan: </span>
                {cat.disposalInstructions}
              </p>
            </div>
            <div className="mt-3">
              {cat.recyclable ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                  ♻️ Bisa Daur Ulang
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                  Tidak Daur Ulang
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
