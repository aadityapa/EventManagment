import { generateSEO } from "@/lib/seo";
import { LoginForm } from "@/components/auth/login-form";
import { Suspense } from "react";

export const metadata = generateSEO({
  title: "Sign in",
  description: "Sign in to manage your bookings, payments, and event timeline.",
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <div className="container-page py-12 sm:py-16">
      <Suspense fallback={<div className="glass-card mx-auto w-full max-w-md p-6 sm:p-8 animate-pulse" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

