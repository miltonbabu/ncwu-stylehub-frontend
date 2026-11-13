"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Order } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/utils";
import { PackageSearch } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const STATUS_TONES: Record<string, "gold" | "primary" | "accent" | "green" | "red" | "gray"> = {
  pending: "gold",
  paid: "primary",
  shipped: "accent",
  completed: "green",
  cancelled: "red",
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ready && !user) {
      router.replace("/auth/sign-in?next=/orders");
      return;
    }
    if (user) {
      api<Order[]>("/orders")
        .then(setOrders)
        .catch(() => setOrders([]))
        .finally(() => setLoading(false));
    }
  }, [ready, user, router]);

  if (!ready || !user || loading) {
    return (
      <div className="mx-auto max-w-4xl animate-pulse px-4 py-16">
        <div className="h-96 rounded-3xl bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-brand-text">My Orders</h1>
      <p className="mt-1 text-gray-500">Track and review your purchase history.</p>

      {orders.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-gray-200 py-20 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-primary">
            <PackageSearch className="h-8 w-8" />
          </span>
          <p className="mt-4 font-heading text-lg font-semibold text-brand-text">No orders yet</p>
          <p className="mt-1 text-sm text-gray-500">When you place an order it will show up here.</p>
          <Button className="mt-6" onClick={() => router.push("/shop")}>
            Start Shopping
          </Button>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-heading font-bold text-brand-text">Order #{order.id}</p>
                  <p className="text-xs text-gray-500">Placed on {formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={STATUS_TONES[order.status] ?? "gray"}>{order.status.toUpperCase()}</Badge>
                  <span className="font-heading font-bold text-brand-text">{formatPrice(order.total)}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-gray-500/10 pt-4">
                <p className="line-clamp-1 text-sm text-gray-500">
                  {order.items.map((i) => `${i.product_name} × ${i.quantity}`).join(", ")}
                </p>
                <Link href={`/orders/${order.id}`} className="ml-auto">
                  <Button variant="outline" size="sm">View Details</Button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
