import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";
import { savePhotos } from "@/lib/storage";
import { parseVespaForm } from "@/lib/vespa-form";

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.redirect(new URL("/login", req.url), 303);
  }

  const formData = await req.formData();
  const parsed = parseVespaForm(formData);

  if (parsed.error) {
    const url = new URL("/garage/new", req.url);
    url.searchParams.set("error", parsed.error);
    return NextResponse.redirect(url, 303);
  }

  const photoFiles = formData.getAll("photos").filter((f): f is File => f instanceof File);
  const photoUrls = await savePhotos(photoFiles.slice(0, 8));

  const vespa = await prisma.vespa.create({
    data: {
      ownerId: userId,
      year: parsed.data.year,
      model: parsed.data.model,
      vin: parsed.data.vin,
      color: parsed.data.color,
      city: parsed.data.city,
      state: parsed.data.state,
      story: parsed.data.story,
      photos: { create: photoUrls.map((url) => ({ url })) },
    },
  });

  return NextResponse.redirect(new URL(`/vespa/${vespa.id}`, req.url), 303);
}
