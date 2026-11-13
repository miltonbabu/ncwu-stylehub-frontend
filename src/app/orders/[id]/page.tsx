"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Order } from "@/lib/types";
import { formatDate, formatPrice, imgFallback, paymentLabel } from "@/lib/utils";
import { ArrowLeft, MapPin, Phone, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const STATUS_TONES: Record<string, "gold" | "primary" | "accent" | "green" | "red" | "gray"> = {
  pending: "gold",
  paid: "primary",
  shipped: "accent",
  completed: "green",
  cancelled: "red",
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, ready } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ready && !user) {
      router.replace(`/auth/sign-in?next=/orders/${id}`);
      return;
    }
    if (user && id) {
      api<Order>(`/orders/${id}`)
        .then(setOrder)
        .catch(() => setOrder(null))
        .finally(() => setLoading(false));
    }
  }, [ready, user, id, router]);

  if (!ready || !user || loading) {
    return (
      <div className="mx-auto max-w-4xl animate-pulse px-4 py-16">
        <div className="h-96 rounded-3xl bg-gray-100" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-bold">Order not found</h1>
        <Button className="mt-6" onClick={() => router.push("/orders")}>
          Back to My Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <button
        type="button"
        onClick={() => router.push("/orders")}
        className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to My Orders
      </button>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold text-brand-text">Order #{order.id}</h1>
          <p className="mt-1 text-sm text-gray-500">Placed on {formatDate(order.created_at)}</p>
        </div>
        <Badge tone={STATUS_TONES[order.status] ?? "gray"}>{order.status.toUpperCase()}</Badge>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-gray-100 bg-white">
          <h2 className="border-b border-gray-500/10 px-6 py-4 font-heading text-lg font-bold text-brand-text">
            Items
          </h2>
          <ul className="divide-y divide-gray-500/10">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 px-6 py-4">
                <div className="h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                  <img
                    src={item.product_image || imgFallback(`item-${item.id}`)}
                    alt={item.product_name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = imgFallback(`item-${item.id}`);
                    }}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  {item.product_id ? (
                    <Link href={`/product/${item.product_id}`} className="text-sm font-semibold hover:text-primary">
                      {item.product_name}
                    </Link>
                  ) : (
                    <p className="text-sm font-semibold">{item.product_name}</p>
                  )}
                  <p className="mt-0.5 text-xs text-gray-500">
                    {formatPrice(item.unit_price)} × {item.quantity}
                  </p>
                </div>
                <p className="font-heading font-bold text-brand-text">
                  {formatPrice(item.unit_price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-500/10 px-6 py-4 text-right">
            <p className="text-sm text-gray-500">
              Shipping
              <span className="ml-2 font-semibold text-brand-text">
                {order.shipping && order.shipping > 0 ? formatPrice(order.shipping) : "Free"}
              </span>
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Total <span className="ml-2 font-heading text-xl font-bold text-brand-text">{formatPrice(order.total)}</span>
            </p>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-6">
            <h2 className="font-heading text-lg font-bold text-brand-text">Shipping</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2.5">
                <UserIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {order.shipping_name}
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {order.shipping_address}
              </li>
              {order.shipping_phone && (
                <li className="flex items-start gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {order.shipping_phone}
                </li>
              )}
            </ul>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-6">
            <h2 className="font-heading text-lg font-bold text-brand-text">Payment</h2>
            <p className="mt-3 text-sm text-gray-600">{paymentLabel(order.payment_method)}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
