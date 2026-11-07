"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { WasteReport } from "@/types/waste";

const STATUS_COLORS: Record<string, string> = {
  reported: "#F44336",
  in_progress: "#FF9800",
  resolved: "#4CAF50",
};

const STATUS_LABELS: Record<string, string> = {
  reported: "Dilaporkan",
  in_progress: "Sedang Ditangani",
  resolved: "Selesai",
};

function createIcon(color: string) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${color}; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -9],
  });
}

export default function ReportMap() {
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports")
      .then((res) => res.json())
      .then((data) => {
        setReports(data.reports || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-gray-50 rounded-xl">
        <p className="text-gray-500">Memuat laporan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <MapContainer
        center={[-8.3405, 115.092]}
        zoom={10}
        style={{ height: "500px", width: "100%", borderRadius: "0.75rem" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        {reports.map((report) => {
          const color = STATUS_COLORS[report.status] || STATUS_COLORS.reported;
          return (
            <Marker
              key={report.id}
              position={[report.lat, report.lng]}
              icon={createIcon(color)}
            >
              <Popup>
                <div className="max-w-[200px]">
                  {report.photo_url && (
                    <img
                      src={report.photo_url}
                      alt="Foto laporan"
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                  )}
                  {report.description && (
                    <p className="text-gray-700 text-sm mb-2">
                      {report.description}
                    </p>
                  )}
                  <span
                    className="inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: color }}
                  >
                    {STATUS_LABELS[report.status] || report.status}
                  </span>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(report.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center">
        {Object.entries(STATUS_LABELS).map(([status, label]) => (
          <div key={status} className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full border-2 border-white shadow"
              style={{ backgroundColor: STATUS_COLORS[status] }}
            />
            <span className="text-gray-600 text-sm">{label}</span>
          </div>
        ))}
      </div>

      {/* Count */}
      <p className="text-center text-gray-500 text-sm">
        {reports.length} laporan tercatat
      </p>
    </div>
  );
}
