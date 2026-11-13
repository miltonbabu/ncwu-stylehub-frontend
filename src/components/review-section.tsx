"use client";

import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Review } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { MessageSquare, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { StarRating } from "./star-rating";
import { Button } from "./ui/button";
import { Textarea } from "./ui/form";

export function ReviewSection({ productId }: { productId: number }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadReviews = () => {
    api<Review[]>(`/reviews/product/${productId}`)
      .then(setReviews)
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  };

  useEffect(loadReviews, [productId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      await api("/reviews", {
        method: "POST",
        body: JSON.stringify({ product_id: productId, rating, comment }),
      });
      setComment("");
      setRating(5);
      setMessage({ type: "success", text: "Review submitted! It will appear after admin approval." });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to submit review" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-16 grid gap-10 lg:grid-cols-[1fr_380px]">
      <div>
        <h2 className="flex items-center gap-2 font-heading text-2xl font-bold text-brand-text">
          <MessageSquare className="h-6 w-6 text-primary" aria-hidden />
          Customer Reviews
        </h2>

        {loading ? (
          <div className="mt-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <ul className="mt-6 space-y-4">
            {reviews.map((review) => (
              <li key={review.id} className="rounded-2xl border border-gray-100 bg-white p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <UserIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-brand-text">{review.user_name}</p>
                    <p className="text-xs text-gray-400">{formatDate(review.created_at)}</p>
                  </div>
                  <StarRating value={review.rating} size={14} className="ml-auto" />
                </div>
                <p className="mt-3 leading-relaxed text-gray-600">{review.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 rounded-2xl border border-dashed border-gray-200 py-10 text-center text-gray-500">
            No reviews yet. Be the first to review this product!
          </p>
        )}
      </div>

      <div className="h-fit rounded-2xl border border-gray-100 bg-gray-50/70 p-6">
        <h3 className="font-heading text-lg font-bold text-brand-text">Write a Review</h3>
        {user ? (
          <form onSubmit={submit} className="mt-4 space-y-4">
            <div>
              <p className="mb-1.5 text-sm font-semibold text-brand-text">Your Rating</p>
              <StarRating value={rating} size={24} interactive onChange={setRating} />
            </div>
            <div>
              <label htmlFor="review-comment" className="mb-1.5 block text-sm font-semibold text-brand-text">
                Your Review
              </label>
              <Textarea
                id="review-comment"
                rows={4}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share what you liked or disliked..."
              />
            </div>
            {message && (
              <p className={message.type === "success" ? "text-sm text-primary" : "text-sm text-red-600"}>
                {message.text}
              </p>
            )}
            <Button type="submit" loading={submitting} className="w-full">
              Submit Review
            </Button>
          </form>
        ) : (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Sign in to share your experience with this product.</p>
            <Link href="/auth/sign-in">
              <Button className="mt-4 w-full">Sign In to Review</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
