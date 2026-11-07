import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import type { WasteReport } from "@/types/waste";

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("waste_reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Gagal memuat laporan." },
        { status: 500 }
      );
    }

    return NextResponse.json({ reports: data as WasteReport[] });
  } catch {
    return NextResponse.json(
      { error: "Gagal memuat laporan." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  let body: {
    lat?: number;
    lng?: number;
    description?: string;
    photo?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Format permintaan tidak valid." },
      { status: 400 }
    );
  }

  const { lat, lng, description, photo } = body;

  if (lat == null || lng == null) {
    return NextResponse.json(
      { error: "Lokasi diperlukan." },
      { status: 400 }
    );
  }

  if (!photo) {
    return NextResponse.json(
      { error: "Foto diperlukan." },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabase();

    // Convert base64 data URL to Blob for storage upload
    const base64Response = await fetch(photo);
    const blob = await base64Response.blob();

    const filename = `${crypto.randomUUID()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("report-photos")
      .upload(filename, blob, { contentType: "image/jpeg" });

    if (uploadError) {
      return NextResponse.json(
        { error: "Gagal menyimpan laporan. Silakan coba lagi." },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("report-photos")
      .getPublicUrl(filename);

    const photoUrl = publicUrlData.publicUrl;

    const { data: reportData, error: insertError } = await supabase
      .from("waste_reports")
      .insert({
        lat,
        lng,
        description: description || null,
        photo_url: photoUrl,
        status: "reported",
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: "Gagal menyimpan laporan. Silakan coba lagi." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { report: reportData as WasteReport },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Gagal menyimpan laporan. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
