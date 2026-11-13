"use client";

import { Sparkles, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface WelcomeFlash {
  name: string;
  mode: "login" | "signup";
}

export function WelcomeBanner() {
  const [flash, setFlash] = useState<WelcomeFlash | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("stylehub_welcome");
      if (!raw) return;
      localStorage.removeItem("stylehub_welcome");
      const parsed = JSON.parse(raw) as WelcomeFlash;
      if (parsed && parsed.name) setFlash(parsed);
    } catch {
      /* ignore malformed flash */
    }
  }, [pathname]);

  useEffect(() => {
    if (!flash) return;
    const timer = setTimeout(() => setFlash(null), 10000);
    return () => clearTimeout(timer);
  }, [flash]);

  if (!flash) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div
        role="status"
        className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-primary/20 bg-white px-5 py-3.5 shadow-lg shadow-primary/10"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white">
          <Sparkles className="h-4 w-4" aria-hidden />
        </span>
        <p className="text-sm font-semibold text-brand-text">
          {flash.mode === "signup"
            ? `Welcome to NCWU StyleHub, ${flash.name}!`
            : `Welcome back, ${flash.name}!`}
        </p>
        <button
          type="button"
          onClick={() => setFlash(null)}
          aria-label="Dismiss welcome message"
          className="cursor-pointer rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-brand-text"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
