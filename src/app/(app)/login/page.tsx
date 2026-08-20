import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

// This depends on the signed-in user's session — never statically cache it.
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <p className="mb-3 text-xs font-bold tracking-[0.2em] text-muted uppercase">
        Sign in / sign up
      </p>
      <h1 className="mb-3 text-3xl font-black tracking-tight sm:text-4xl">
        Enter your email.
      </h1>
      <p className="mb-8 text-foreground/70">
        We&apos;ll email you a magic link.
      </p>

      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
