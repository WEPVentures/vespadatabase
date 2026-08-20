import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

// Every page here reads live data (Netlify Blobs / session), and
// Blobs credentials only exist at request time, not during the build's
// static prerendering step — never statically optimize these.
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <p className="mb-3 text-xs font-bold tracking-[0.2em] text-muted uppercase">
        Sign in
      </p>
      <h1 className="mb-3 text-3xl font-black tracking-tight sm:text-4xl">
        Check your inbox, not your memory.
      </h1>
      <p className="mb-8 text-foreground/70">
        We&apos;ll email you a magic link. No password to set, forget, or reuse.
      </p>

      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
