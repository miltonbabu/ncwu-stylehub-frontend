"use client";

import { ReviewSection } from "@/components/review-section";
import { StarRating } from "@/components/star-rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/types";
import { cn, formatPrice, imgFallback } from "@/lib/utils";
import { ChevronRight, Heart, Minus, Plus, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { add } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api<Product>(`/products/${id}`)
      .then((p) => {
        setProduct(p);
        setActiveImage(p.image_url);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-3xl bg-gray-100" />
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
          <div className="h-8 w-3/4 animate-pulse rounded bg-gray-100" />
          <div className="h-6 w-32 animate-pulse rounded bg-gray-100" />
          <div className="h-24 w-full animate-pulse rounded bg-gray-100" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-bold">Product not found</h1>
        <p className="mt-2 text-gray-500">The product you are looking for does not exist.</p>
        <Button className="mt-6" onClick={() => router.push("/shop")}>
          Back to Shop
        </Button>
      </div>
    );
  }

  const gallery = [product.image_url, ...product.images.map((i) => i.image_url)].filter(
    (url, idx, arr) => url && arr.indexOf(url) === idx,
  );
  const discount =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
      : 0;

  const addToCart = () => {
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const buyNow = () => {
    add(product, qty);
    router.push("/checkout");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-gray-500">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/shop" className="hover:text-primary">Shop</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/shop?category=${product.category_slug}`} className="hover:text-primary">
          {product.category_name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate text-brand-text">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-50">
            <img
              key={activeImage}
              src={activeImage}
              alt={product.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = imgFallback(`product-${product.id}`);
              }}
              className="h-full w-full animate-fade-in object-cover transition-transform duration-500 hover:scale-[1.03]"
            />
            <div className="absolute left-4 top-4 flex flex-col gap-1.5">
              {discount > 0 && <Badge tone="accent">-{discount}%</Badge>}
              {product.is_featured && <Badge tone="gold">Featured</Badge>}
            </div>
          </div>
          {gallery.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 sm:gap-3">
              {gallery.map((url) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setActiveImage(url)}
                  className={cn(
                    "h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-200 sm:h-20 sm:w-20",
                    activeImage === url
                      ? "scale-105 border-primary shadow-md shadow-primary/10"
                      : "border-transparent opacity-80 hover:border-gray-300 hover:opacity-100",
                  )}
                  aria-label="View product image"
                >
                  <img
                    src={url}
                    alt=""
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = imgFallback(`product-${product.id}`);
                    }}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <Link
              href={`/shop?category=${product.category_slug}`}
              className="text-sm font-semibold uppercase tracking-wider text-primary hover:underline"
            >
              {product.category_name}
            </Link>
            <h1 className="mt-2 font-heading text-3xl font-bold text-brand-text">{product.name}</h1>
            <div className="mt-3 flex items-center gap-2">
              <StarRating value={product.avg_rating} size={18} />
              <span className="text-sm text-gray-500">
                {product.avg_rating.toFixed(1)} · {product.review_count} review{product.review_count === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-heading text-3xl font-bold text-brand-text">{formatPrice(product.price)}</span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="text-lg text-gray-400 line-through">{formatPrice(product.compare_at_price)}</span>
            )}
            {discount > 0 && <Badge tone="accent">Save {discount}%</Badge>}
          </div>

          <p className="leading-relaxed text-gray-600">{product.description}</p>

          <div className="flex items-center gap-3">
            <Badge tone={product.stock > 0 ? "green" : "red"}>
              {product.stock > 0 ? `In stock (${product.stock} available)` : "Out of stock"}
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-full border border-gray-200">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="cursor-pointer rounded-l-full px-4 py-2.5 text-gray-500 hover:bg-brand-soft"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="cursor-pointer rounded-r-full px-4 py-2.5 text-gray-500 hover:bg-brand-soft"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button size="lg" onClick={addToCart} disabled={product.stock <= 0} className="flex-1">
              <ShoppingBag className="h-5 w-5" aria-hidden />
              {added ? "Added to Cart!" : "Add to Cart"}
            </Button>
            <Button size="lg" variant="accent" onClick={buyNow} disabled={product.stock <= 0}>
              Buy Now
            </Button>
            <button
              type="button"
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-colors hover:border-red-300 hover:text-red-500"
              aria-label="Add to wishlist"
            >
              <Heart className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-2xl bg-brand-bg p-5">
            <div className="flex items-center gap-2.5">
              <Truck className="h-5 w-5 text-primary" aria-hidden />
              <div>
                <p className="text-sm font-semibold text-brand-text">Free Shipping</p>
                <p className="text-xs text-gray-500">Orders over ¥80</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-primary" aria-hidden />
              <div>
                <p className="text-sm font-semibold text-brand-text">Secure Checkout</p>
                <p className="text-xs text-gray-500">100% protected payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReviewSection productId={product.id} />
    </div>
  );
}
