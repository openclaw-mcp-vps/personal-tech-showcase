"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function UnlockPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/paywall/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to verify purchase");
      }

      router.push("/dashboard");
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Unable to verify purchase",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-5 py-16 sm:px-6">
      <section className="rounded-2xl border border-[#30363d] bg-[#111827] p-7 shadow-[0_22px_60px_rgba(0,0,0,0.35)]">
        <p className="text-xs uppercase tracking-[0.18em] text-[#8b949e]">Unlock Access</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#e6edf3]">Claim your subscription</h1>
        <p className="mt-2 text-sm leading-6 text-[#9da7b3]">
          Enter the same email used during Stripe checkout. Once verified, your paid
          dashboard access is stored in a secure cookie.
        </p>

        <form className="mt-5 space-y-3" onSubmit={onSubmit}>
          <label htmlFor="purchase-email" className="text-sm font-medium text-[#c9d1d9]">
            Purchase Email
          </label>
          <input
            id="purchase-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            required
            className="w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-3.5 py-2.5 text-sm text-[#e6edf3] outline-none transition focus:border-[#58a6ff]"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg border border-[#2f81f7] bg-[#1f6feb] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2f81f7] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Verifying..." : "Unlock Dashboard"}
          </button>
        </form>

        {error ? (
          <p className="mt-3 rounded-lg border border-[#f85149]/40 bg-[#f85149]/10 px-3 py-2 text-sm text-[#ffb4ad]">
            {error}
          </p>
        ) : null}
      </section>
    </main>
  );
}
