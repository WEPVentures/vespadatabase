import { NextRequest, NextResponse } from "next/server";
import { isUsernameTaken, setUsername } from "@/lib/data/users";
import { getSessionUserId } from "@/lib/session";
import { isValidUsername, normalizeUsername } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const rawUsername = typeof body?.username === "string" ? body.username : "";
  const username = normalizeUsername(rawUsername);

  if (!isValidUsername(username)) {
    return NextResponse.json(
      { error: "Usernames are 3-20 characters: lowercase letters, numbers, - or _." },
      { status: 400 }
    );
  }

  if (await isUsernameTaken(username, userId)) {
    return NextResponse.json({ error: "That username is taken." }, { status: 409 });
  }

  await setUsername(userId, username);

  return NextResponse.json({ ok: true, username });
}
