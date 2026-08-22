import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { UsernameForm } from "@/app/(app)/onboarding/UsernameForm";

// Depends on the signed-in user's session — never statically cache it.
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.username) redirect("/onboarding");

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="mb-3 text-3xl font-black tracking-tight sm:text-4xl">Account</h1>
      <p className="mb-8 text-foreground/70">
        Changing your username also changes your public garage URL — vespadatabase.com/garage/
        <span className="font-semibold">yourname</span>
      </p>

      <UsernameForm
        initialUsername={user.username}
        redirectTo={`/garage`}
        submitLabel="Save username"
      />
    </div>
  );
}
