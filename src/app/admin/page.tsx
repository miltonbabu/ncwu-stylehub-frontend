"use client";

import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import type { AdminStats, Review } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import {
  AlertTriangle,
  ClipboardList,
  MessageSquare,
  Package,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pending, setPending] = useState<Review[]>([]);

  useEffect(() => {
    api<AdminStats>("/admin/stats").then(setStats).catch(() => setStats(null));
    api<Review[]>("/admin/reviews?status_filter=pending").then(setPending).catch(() => setPending([]));
  }, []);

  const cards = [
    { label: "Products", value: stats?.products ?? "—", icon: Package, href: "/admin/products", tone: "text-primary bg-primary/10" },
    { label: "Total Orders", value: stats?.orders ?? "—", icon: ClipboardList, href: "/admin/orders", tone: "text-accent bg-accent/10" },
    { label: "Users", value: stats?.users ?? "—", icon: Users, href: "/admin/users", tone: "text-indigo-600 bg-indigo-50" },
    {
      label: "Revenue",
      value: stats ? formatPrice(stats.revenue) : "—",
      icon: TrendingUp,
      href: "/admin/orders",
      tone: "text-primary bg-brand-soft",
    },
    {
      label: "Pending Reviews",
      value: stats?.pending_reviews ?? "—",
      icon: MessageSquare,
      href: "/admin/reviews",
      tone: "text-amber-600 bg-amber-50",
    },
    {
      label: "Low Stock",
      value: stats?.low_stock ?? "—",
      icon: AlertTriangle,
      href: "/admin/products",
      tone: "text-red-600 bg-red-50",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-brand-text">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Store overview and moderation shortcuts.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-gray-100 bg-white p-5 transition-shadow duration-200 hover:shadow-md"
          >
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.tone}`}>
              <card.icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-gray-400">{card.label}</p>
            <p className="mt-1 font-heading text-2xl font-bold text-brand-text">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-brand-text">Pending Reviews</h2>
            <Link href="/admin/reviews" className="text-sm font-semibold text-primary hover:underline">
              Manage all
            </Link>
          </div>
          {pending.length === 0 ? (
            <p className="mt-4 rounded-xl bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
              Review queue is empty. Great job!
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {pending.slice(0, 4).map((review) => (
                <li key={review.id} className="flex items-start gap-3 rounded-xl border border-gray-200/70 p-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-brand-text">{review.user_name}</p>
                      <Badge tone="gold">{review.rating}★</Badge>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-gray-500">{review.comment}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-6">
          <h2 className="font-heading text-lg font-bold text-brand-text">Quick Actions</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link
              href="/admin/products/new"
              className="rounded-xl bg-primary px-4 py-4 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Upload Product
            </Link>
            <Link
              href="/admin/orders"
              className="rounded-xl border border-gray-200 px-4 py-4 text-center text-sm font-semibold text-brand-text transition-colors hover:border-primary hover:text-primary"
            >
              Manage Orders
            </Link>
            <Link
              href="/admin/users"
              className="rounded-xl border border-gray-200 px-4 py-4 text-center text-sm font-semibold text-brand-text transition-colors hover:border-primary hover:text-primary"
            >
              Manage Users
            </Link>
            <Link
              href="/admin/reviews"
              className="rounded-xl border border-gray-200 px-4 py-4 text-center text-sm font-semibold text-brand-text transition-colors hover:border-primary hover:text-primary"
            >
              Moderate Reviews
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
