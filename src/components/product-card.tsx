"use client";

import type { Product } from "@/lib/types";
import { cn, formatPrice, imgFallback } from "@/lib/utils";
import { Eye, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { Badge } from "./ui/badge";
import { StarRating } from "./star-rating";
import { useState } from "react";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [src, setSrc] = useState(product.image_url);

  const discount =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
      : 0;

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    add(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5",
        className,
      )}
    >
      <Link href={`/product/${product.id}`} className="relative block aspect-[4/5] overflow-hidden bg-gray-50">
        <img
          src={src}
          alt={product.name}
          loading="lazy"
          onError={() => setSrc(imgFallback(`product-${product.id}`))}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1 sm:left-3 sm:top-3">
          {discount > 0 && <Badge tone="accent">-{discount}%</Badge>}
          {product.is_featured && <Badge tone="gold">Featured</Badge>}
          {product.stock <= 0 && <Badge tone="gray">Sold out</Badge>}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent opacity-60 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100" />
        <div className="absolute inset-x-2 bottom-2 flex translate-y-0 gap-2 opacity-100 transition-all duration-200 sm:inset-x-3 sm:bottom-3 lg:translate-y-3 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
          <button
            type="button"
            onClick={onAdd}
            disabled={product.stock <= 0}
            className={cn(
              "flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full text-xs font-semibold text-white transition-colors disabled:opacity-50 sm:h-10 sm:text-sm",
              added ? "bg-emerald-600" : "bg-primary hover:bg-primary-dark",
            )}
          >
            <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
            {added ? "Added!" : "Add to Cart"}
          </button>
          <Link
            href={`/product/${product.id}`}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-brand-text shadow transition-colors hover:text-primary sm:h-10 sm:w-10"
            aria-label={`View ${product.name}`}
          >
            <Eye className="h-4 w-4" />
          </Link>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-3 sm:gap-1.5 sm:p-4">
        <Link
          href={`/shop?category=${product.category_slug}`}
          className="text-[10px] font-semibold uppercase tracking-wider text-primary hover:underline sm:text-xs"
        >
          {product.category_name}
        </Link>
        <Link href={`/product/${product.id}`} className="line-clamp-2 font-heading text-xs font-semibold text-brand-text hover:text-primary sm:text-sm">
          {product.name}
        </Link>
        <div className="flex items-center gap-1.5">
          <StarRating value={product.avg_rating} size={12} />
          <span className="text-[11px] text-gray-500 sm:text-xs">({product.review_count})</span>
        </div>
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="font-heading text-base font-bold text-brand-text sm:text-lg">{formatPrice(product.price)}</span>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="text-xs text-gray-400 line-through sm:text-sm">{formatPrice(product.compare_at_price)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
