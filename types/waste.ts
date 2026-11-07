export type ConfidenceLevel = "high" | "medium" | "low";

export type ClassificationResult = {
  category: string;
  categoryName: string;
  itemName: string;
  recyclable: boolean;
  disposalInstructions: string;
  ecoTip: string;
  confidence: ConfidenceLevel;
};

export type ReportStatus = "reported" | "in_progress" | "resolved";

export type WasteReport = {
  id: string;
  lat: number;
  lng: number;
  description: string;
  photo_url: string;
  status: ReportStatus;
  created_at: string;
};
