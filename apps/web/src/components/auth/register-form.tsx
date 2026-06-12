"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { toast } from "sonner";
import { analytics } from "@/lib/analytics";

export function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = useMemo(() => params.get("next") || "/dashboard", [params]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    analytics.signupStart();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: phone || undefined, password, role: "CLIENT" }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Registration failed");
      analytics.signupComplete();
      toast.success("Account created.");
      router.replace(next);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="glass-card mx-auto w-full max-w-md p-6 sm:p-8" aria-label="Create account form">
      <h1 className="font-display text-2xl font-bold">Create account</h1>
      <p className="mt-1 text-sm text-muted">Book, pay, and track your event journey.</p>

      <div className="mt-6 space-y-4">
        <FormInput label="Full name" name="name" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} />
        <FormInput label="Email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <FormInput label="Phone" name="phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} hint="Optional — for event coordination updates" />
        <FormInput label="Password" name="password" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} hint="Minimum 8 characters." />

        <Button type="submit" className="w-full btn-premium-hover" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </Button>
      </div>

      <p className="mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold text-primary">
          Sign in
        </Link>
      </p>
    </form>
  );
}
