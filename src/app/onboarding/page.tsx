import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { UsernameForm } from "./UsernameForm";

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
      <p className="mb-3 text-xs font-bold tracking-[0.2em] text-foreground/50 uppercase">
        One last thing
      </p>
      <h1 className="mb-3 text-4xl font-black tracking-tight">Pick a username.</h1>
      <p className="mb-8 text-foreground/70">
        This becomes your public garage URL: vespadatabase.app/garage/
        <span className="font-semibold">yourname</span>
      </p>

      <UsernameForm />
    </div>
  );
}
