import { getUserById } from "@/lib/data/users";
import { getSessionUserId } from "@/lib/session";

export async function getCurrentUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;

  return getUserById(userId);
}
