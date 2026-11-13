"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export function StarRating({
  value,
  size = 16,
  interactive = false,
  onChange,
  className,
}: {
  value: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} role={interactive ? "radiogroup" : undefined}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = value >= star - 0.25;
        return interactive ? (
          <button
            key={star}
            type="button"
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            className="cursor-pointer transition-transform duration-150 hover:scale-110"
            onClick={() => onChange?.(star)}
          >
            <Star
              width={size}
              height={size}
              className={filled ? "fill-gold text-gold" : "fill-gray-200 text-gray-200"}
            />
          </button>
        ) : (
          <Star
            key={star}
            width={size}
            height={size}
            className={filled ? "fill-gold text-gold" : "fill-gray-200 text-gray-200"}
            aria-hidden
          />
        );
      })}
    </div>
  );
}
