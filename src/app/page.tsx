"use client";

import { CategoryGrid, PromoSections, TrustSection } from "@/components/home-sections";
import { HeroCarousel } from "@/components/hero-carousel";
import { ProductCard } from "@/components/product-card";
import { api } from "@/lib/api";
import type { Banner, Category, Product, Promotion } from "@/lib/types";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function ProductSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-gray-100">
      <div className="aspect-[4/5] bg-gray-100" />
      <div className="space-y-2.5 p-4">
        <div className="h-3 w-1/3 rounded bg-gray-100" />
        <div className="h-4 w-2/3 rounded bg-gray-100" />
        <div className="h-5 w-1/4 rounded bg-gray-100" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [b, c, p, pr] = await Promise.all([
          api<Banner[]>("/banners").catch(() => [] as Banner[]),
          api<Category[]>("/categories").catch(() => [] as Category[]),
          api<Product[]>("/products?page_size=16&sort=newest").catch(() => [] as Product[]),
          api<Promotion[]>("/promotions").catch(() => [] as Promotion[]),
        ]);
        if (!cancelled) {
          setBanners(b);
          setCategories(c);
          setProducts(p);
          setPromotions(pr);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const featured = products.filter((p) => p.is_featured).slice(0, 8);
  const newArrivals = [...products].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  ).slice(0, 4);

  return (
    <div className="pb-4">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <HeroCarousel banners={banners} />
      </div>

      <CategoryGrid categories={categories} />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-widest text-accent">
              <Flame className="h-4 w-4" aria-hidden /> Handpicked
            </p>
            <h2 className="mt-1 font-heading text-2xl font-bold text-brand-text sm:text-3xl">
              Featured Products
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden items-center gap-1.5 text-sm font-semibold text-primary hover:underline sm:inline-flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="stagger-fade grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="stagger-fade grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center">
            <p className="text-gray-500">No featured products yet.</p>
            <Link href="/shop" className="mt-2 inline-block font-semibold text-primary hover:underline">
              Browse the shop
            </Link>
          </div>
        )}
      </section>

      <PromoSections promotions={promotions} />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-widest text-primary">
              <Sparkles className="h-4 w-4" aria-hidden /> Just In
            </p>
            <h2 className="mt-1 font-heading text-2xl font-bold text-brand-text sm:text-3xl">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/shop?sort=newest"
            className="hidden items-center gap-1.5 text-sm font-semibold text-primary hover:underline sm:inline-flex"
          >
            Shop new <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="stagger-fade grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
          {(loading ? Array.from({ length: 4 }).map(() => null) : newArrivals).map((product, i) =>
            product ? (
              <ProductCard key={product.id} product={product} />
            ) : (
              <ProductSkeleton key={i} />
            ),
          )}
        </div>
      </section>

      <TrustSection />
    </div>
  );
}
