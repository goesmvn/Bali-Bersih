import dynamic from "next/dynamic";

const ReportMap = dynamic(() => import("@/components/ReportMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[500px] bg-gray-50 rounded-xl">
      <p className="text-gray-500">Memuat peta...</p>
    </div>
  ),
});

export default function LaporanPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-green-700">
          Peta Laporan Sampah Liar
        </h1>
        <p className="text-gray-600 mt-1 text-sm">
          Lihat lokasi penumpukan sampah yang dilaporkan masyarakat di Bali.
        </p>
      </div>

      <ReportMap />
    </div>
  );
}
