import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";

export async function GET(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const store = getStore("photos");

  const result = await store.getWithMetadata(key, { type: "arrayBuffer" });
  if (!result) {
    return new NextResponse(null, { status: 404 });
  }

  const contentType =
    typeof result.metadata?.contentType === "string"
      ? result.metadata.contentType
      : "application/octet-stream";

  return new NextResponse(result.data, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
