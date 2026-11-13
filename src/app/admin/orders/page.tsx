"use client";

import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import type { Order } from "@/lib/types";
import { formatDate, formatPrice, paymentLabel } from "@/lib/utils";
import { Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const STATUS_TONES: Record<string, "gold" | "primary" | "accent" | "green" | "red" | "gray"> = {
  pending: "gold",
  paid: "primary",
  shipped: "accent",
  completed: "green",
  cancelled: "red",
};

const STATUSES = ["pending", "paid", "shipped", "completed", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    api<Order[]>("/admin/orders")
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: number, status: string) => {
    setBusyId(id);
    try {
      const updated = await api<Order>(`/admin/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  };

  const deleteOrder = async (id: number) => {
    if (!window.confirm(`Permanently delete order #${id}? This cannot be undone.`)) {
      return;
    }
    setBusyId(id);
    try {
      await api(`/admin/orders/${id}`, { method: "DELETE" });
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  const filtered = orders.filter(
    (o) =>
      String(o.id).includes(query) ||
      o.shipping_name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-brand-text">Order Management</h1>
        <p className="mt-1 text-sm text-gray-500">Track orders and update fulfillment status.</p>
      </div>

      <div className="mb-4 relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by order # or customer..."
          aria-label="Search orders"
          className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 text-sm focus:border-primary focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
              <th className="px-5 py-4">Order</th>
              <th className="px-5 py-4">Customer</th>
              <th className="px-5 py-4">Items</th>
              <th className="px-5 py-4">Total</th>
              <th className="px-5 py-4">Payment</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-500/5">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={6} className="px-5 py-4">
                    <div className="h-10 animate-pulse rounded bg-gray-100" />
                  </td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-gray-50/60">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-brand-text">#{order.id}</p>
                    <p className="text-xs text-gray-400">{formatDate(order.created_at)}</p>
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-brand-text">{order.shipping_name}</p>
                    <p className="line-clamp-1 max-w-48 text-xs text-gray-400">{order.shipping_address}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {order.items.reduce((sum, i) => sum + i.quantity, 0)} item(s)
                  </td>
                  <td className="px-5 py-3 font-semibold text-brand-text">{formatPrice(order.total)}</td>
                  <td className="px-5 py-3 text-gray-600">{paymentLabel(order.payment_method)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Badge tone={STATUS_TONES[order.status] ?? "gray"}>{order.status}</Badge>
                      <select
                        value={order.status}
                        disabled={busyId === order.id}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        aria-label={`Update status for order ${order.id}`}
                        className="cursor-pointer rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:border-primary focus:outline-none disabled:opacity-50"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        disabled={busyId === order.id}
                        onClick={() => deleteOrder(order.id)}
                        title="Delete order permanently"
                        className="inline-flex cursor-pointer items-center rounded-lg border border-red-200 p-1.5 text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
