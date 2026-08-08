"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
    });
    setBusy(false);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Could not log in.");
      return;
    }
    if (data.role !== "admin") {
      setError("This account does not have admin access.");
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-8">
        <p className="text-center text-xs uppercase tracking-luxe text-gold-soft">
          Sanskriti · Admin
        </p>
        <h1 className="mt-2 text-center font-display text-3xl text-ivory">Studio Login</h1>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <input name="email" type="email" required placeholder="Email" className="w-full rounded-lg border border-white/15 bg-transparent px-4 py-3 text-ivory outline-none placeholder:text-ivory/40 focus:border-gold" />
          <input name="password" type="password" required placeholder="Password" className="w-full rounded-lg border border-white/15 bg-transparent px-4 py-3 text-ivory outline-none placeholder:text-ivory/40 focus:border-gold" />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={busy} className="w-full rounded-full bg-gold px-6 py-3 text-sm font-medium uppercase tracking-[0.12em] text-white transition hover:bg-gold-deep disabled:opacity-50">
            {busy ? "Signing in…" : "Enter Studio"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ink" />}>
      <AdminLoginForm />
    </Suspense>
  );
}
