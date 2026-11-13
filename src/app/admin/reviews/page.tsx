"use client";

import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import type { Review } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { Check, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

const FILTERS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = (status: string) => {
    setLoading(true);
    setError("");
    const qs = status ? `?status_filter=${status}` : "";
    api<Review[]>(`/admin/reviews${qs}`)
      .then(setReviews)
      .catch((err) => {
        setReviews([]);
        setError(err instanceof Error ? err.message : "Failed to load reviews");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const moderate = async (id: number, action: "approve" | "reject" | "delete") => {
    if (action === "delete" && !window.confirm("Delete this review permanently?")) return;
    setBusyId(id);
    try {
      if (action === "delete") {
        await api(`/admin/reviews/${id}`, { method: "DELETE" });
        setReviews((prev) => prev.filter((r) => r.id !== id));
      } else {
        const updated = await api<Review>(`/admin/reviews/${id}/${action}`, { method: "POST" });
        if (filter && filter !== updated.status) {
          setReviews((prev) => prev.filter((r) => r.id !== id));
        } else {
          setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
        }
      }
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-brand-text">Review Management</h1>
        <p className="mt-1 text-sm text-gray-500">Moderate customer product reviews before they go live.</p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200",
              filter === f.value
                ? "border-primary bg-primary text-white"
                : "border-gray-200 bg-white text-brand-text hover:border-primary hover:text-primary",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          <p className="font-semibold">Could not load reviews</p>
          <p className="mt-1">{error}</p>
          <button
            type="button"
            onClick={() => load(filter)}
            className="mt-3 cursor-pointer rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold hover:bg-red-100"
          >
            Try Again
          </button>
        </div>
      ) : loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center text-gray-500">
          No reviews in this queue.
        </div>
      ) : (
        <ul className="space-y-3">
          {reviews.map((review) => (
            <li key={review.id} className="rounded-2xl border border-gray-100 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <p className="font-semibold text-brand-text">{review.user_name}</p>
                    <Badge tone="gray">Product #{review.product_id}</Badge>
                    <Badge tone="gold">{review.rating} star{review.rating > 1 ? "s" : ""}</Badge>
                    <Badge
                      tone={review.status === "approved" ? "green" : review.status === "rejected" ? "red" : "gold"}
                    >
                      {review.status}
                    </Badge>
                    <span className="text-xs text-gray-400">{formatDate(review.created_at)}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{review.comment}</p>
                </div>
                <div className="flex gap-2">
                  {review.status !== "approved" && (
                    <button
                      type="button"
                      disabled={busyId === review.id}
                      onClick={() => moderate(review.id, "approve")}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
                    >
                      <Check className="h-3.5 w-3.5" /> Approve
                    </button>
                  )}
                  {review.status !== "rejected" && (
                    <button
                      type="button"
                      disabled={busyId === review.id}
                      onClick={() => moderate(review.id, "reject")}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-semibold text-gray-600 transition-colors hover:border-amber-300 hover:text-amber-600 disabled:opacity-50"
                    >
                      <X className="h-3.5 w-3.5" /> Reject
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={busyId === review.id}
                    onClick={() => moderate(review.id, "delete")}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-semibold text-gray-600 transition-colors hover:border-red-300 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
