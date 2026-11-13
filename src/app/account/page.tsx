"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { formatDate } from "@/lib/utils";
import { LayoutDashboard, LogOut, Mail, PackageSearch, ShoppingBag, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountPage() {
  const router = useRouter();
  const { user, ready, logout } = useAuth();

  useEffect(() => {
    if (ready && !user) router.replace("/auth/sign-in?next=/account");
  }, [ready, user, router]);

  if (!ready || !user) {
    return <div className="mx-auto max-w-3xl animate-pulse px-4 py-16"><div className="h-64 rounded-3xl bg-gray-100" /></div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-brand-text">My Account</h1>
      <p className="mt-1 text-gray-500">Manage your profile and orders.</p>

      <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-8">
        <div className="flex items-center gap-5">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white">
            <UserIcon className="h-9 w-9" />
          </span>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-heading text-xl font-bold text-brand-text">{user.name}</h2>
              <Badge tone={user.role === "admin" ? "accent" : "primary"}>{user.role}</Badge>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
              <Mail className="h-4 w-4" /> {user.email}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">Member since {formatDate(user.created_at)}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link href="/orders">
            <Button variant="outline" className="w-full justify-start">
              <PackageSearch className="h-4 w-4" /> My Orders
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="outline" className="w-full justify-start">
              <ShoppingBag className="h-4 w-4" /> Shopping Cart
            </Button>
          </Link>
          {user.role === "admin" && (
            <Link href="/admin">
              <Button variant="outline" className="w-full justify-start">
                <LayoutDashboard className="h-4 w-4" /> Admin Panel
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-50"
            onClick={() => {
              logout();
              router.push("/");
            }}
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
