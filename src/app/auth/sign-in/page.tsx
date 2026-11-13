"use client";

import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { useAuth } from "@/lib/auth-context";
import { Store } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function SignInContent() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/";
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const user = await login(email, password);
      try {
        localStorage.setItem("stylehub_welcome", JSON.stringify({ name: user.name, mode: "login" }));
      } catch {
        /* storage unavailable — skip the welcome flash */
      }
      router.push(user.role === "admin" && next === "/" ? "/admin" : next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-14">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
            <Store className="h-7 w-7" />
          </span>
          <h1 className="mt-5 font-heading text-3xl font-bold text-brand-text">Welcome Back</h1>
          <p className="mt-2 text-sm text-gray-500">Sign in to your NCWU StyleHub account</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <Field label="Email Address" htmlFor="si-email">
            <Input
              id="si-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </Field>
          <Field label="Password" htmlFor="si-password">
            <Input
              id="si-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" loading={submitting} className="w-full">
            Sign In
          </Button>

          <p className="text-center text-sm text-gray-500">
            New to NCWU StyleHub?{" "}
            <Link href={`/auth/sign-up?next=${encodeURIComponent(next)}`} className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </form>

        <div className="mt-6 rounded-2xl bg-brand-soft p-4 text-xs text-brand-text/80">
          <p className="font-semibold">Demo accounts</p>
          <p className="mt-1">Admin: admin@ncwustylehub.com / Admin@123</p>
          <p>Customer: demo@ncwustylehub.com / Demo@123</p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInContent />
    </Suspense>
  );
}
