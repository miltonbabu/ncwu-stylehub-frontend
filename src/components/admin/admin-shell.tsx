"use client";

import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { ThemePicker } from "@/components/theme-picker";
import {
  BarChart3,
  ClipboardList,
  LogOut,
  MessageSquare,
  Package,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (ready && (!user || user.role !== "admin")) {
      router.replace("/auth/sign-in?next=/admin");
    }
  }, [ready, user, router]);

  if (!ready || !user || user.role !== "admin") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const nav = (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200",
              active ? "bg-primary text-white" : "text-brand-tint/80 hover:bg-white/10 hover:text-white",
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-brand-text px-4 py-6 lg:flex">
        <Link href="/" className="mb-8 flex items-center gap-2 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
            <Store className="h-5 w-5 text-white" />
          </span>
          <div>
            <p className="font-heading text-lg font-bold text-white">
              NCWU <span className="text-secondary">StyleHub</span>
            </p>
            <p className="text-[11px] uppercase tracking-wider text-brand-tint/60">Admin Panel</p>
          </div>
        </Link>
        {nav}
        <div className="mt-auto space-y-1">
          <Link
            href="/"
            className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-brand-tint/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Store className="h-5 w-5" /> View Store
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-brand-tint/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-5 w-5" /> Sign Out
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-brand-text px-4 py-6">
            <p className="mb-6 px-2 font-heading text-lg font-bold text-white">Admin Panel</p>
            {nav}
          </aside>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white/90 px-6 backdrop-blur">
          <button
            type="button"
            className="cursor-pointer rounded-lg p-2 hover:bg-gray-100 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open admin menu"
          >
            <ClipboardList className="h-5 w-5" />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <ThemePicker />
            <span className="hidden items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-semibold text-primary sm:flex">
              <ShieldCheck className="h-3.5 w-3.5" /> Admin Mode
            </span>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold leading-tight text-brand-text">{user.name}</p>
                <p className="text-[11px] text-gray-400">Administrator</p>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
