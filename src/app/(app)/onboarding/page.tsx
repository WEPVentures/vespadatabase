import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { UsernameForm } from "./UsernameForm";

// Every page here reads live data (Netlify Blobs / session), and
// Blobs credentials only exist at request time, not during the build's
// static prerendering step — never statically optimize these.
export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.username) {
    redirect("/garage");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <p className="mb-3 text-xs font-bold tracking-[0.2em] text-muted uppercase">
        One last thing
      </p>
      <h1 className="mb-3 text-3xl font-black tracking-tight sm:text-4xl">Pick a username.</h1>
      <p className="mb-8 text-foreground/70">
        This becomes your public garage URL: vespadatabase.app/garage/
        <span className="font-semibold">yourname</span>
      </p>

      <UsernameForm />
    </div>
  );
}
