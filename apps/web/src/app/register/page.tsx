import { generateSEO } from "@/lib/seo";
import { RegisterForm } from "@/components/auth/register-form";
import { Suspense } from "react";

export const metadata = generateSEO({
  title: "Create account",
  description: "Create an account to book, pay, and track your event journey.",
  path: "/register",
  noIndex: true,
});

export default function RegisterPage() {
  return (
    <div className="container-page py-12 sm:py-16">
      <Suspense fallback={<div className="glass-card mx-auto w-full max-w-md p-6 sm:p-8 animate-pulse" />}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}

