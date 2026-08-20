import { NextRequest, NextResponse } from "next/server";
import { getVespaById, updateVespa } from "@/lib/data/vespas";
import { getSessionUserId } from "@/lib/session";
import { savePhotos } from "@/lib/storage";
import { parseVespaForm } from "@/lib/vespa-form";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.redirect(new URL("/login", req.url), 303);
  }

  const existing = await getVespaById(id);
  if (!existing || existing.ownerId !== userId) {
    return NextResponse.redirect(new URL("/garage", req.url), 303);
  }

  const formData = await req.formData();
  const parsed = parseVespaForm(formData);

  if (parsed.error) {
    const url = new URL(`/vespa/${id}/edit`, req.url);
    url.searchParams.set("error", parsed.error);
    return NextResponse.redirect(url, 303);
  }

  const photoFiles = formData.getAll("photos").filter((f): f is File => f instanceof File);
  const photoUrls = await savePhotos(photoFiles.slice(0, 8));

  await updateVespa(
    id,
    {
      year: parsed.data.year,
      model: parsed.data.model,
      vin: parsed.data.vin,
      color: parsed.data.color,
      story: parsed.data.story,
    },
    photoUrls
  );

  return NextResponse.redirect(new URL(`/vespa/${id}`, req.url), 303);
}
