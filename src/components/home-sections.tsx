"use client";

import { getSeasonalPromo } from "@/lib/seasonal";
import type { Category, Promotion } from "@/lib/types";
import { imgFallback } from "@/lib/utils";
import { ArrowRight, BadgePercent, Headphones, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "./ui/badge";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Browse</p>
          <h2 className="mt-1 font-heading text-2xl font-bold text-brand-text sm:text-3xl">
            Shop by Category
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden items-center gap-1.5 text-sm font-semibold text-primary hover:underline sm:inline-flex"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className="group flex flex-col items-center gap-3"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-brand-soft">
              <img
                src={cat.image_url}
                alt={cat.name}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = imgFallback(`cat-${cat.slug}`);
                }}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-brand-text/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            </div>
            <div className="text-center">
              <p className="font-heading text-sm font-semibold text-brand-text transition-colors group-hover:text-primary">
                {cat.name}
              </p>
              <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">{cat.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function PromoSections({ promotions }: { promotions: Promotion[] }) {
  const seasonal = getSeasonalPromo();
  const main = promotions
    .filter((p) => p.position === "home-main")
    .slice(0, 2)
    .map((p, i) =>
      i === 0 ? { ...p, title: seasonal.title, subtitle: seasonal.subtitle, badge: seasonal.badge } : p,
    );
  const strip = promotions.find((p) => p.position === "home-strip");
  const stripTitle = strip ? strip.title.split("$80").join("¥80") : "";
  const stripSubtitle = strip ? strip.subtitle.split("$80").join("¥80") : "";

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {main.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {main.map((promo) => (
            <Link
              key={promo.id}
              href={promo.link_url}
              className="group relative flex h-72 overflow-hidden rounded-3xl bg-brand-text"
            >
              <img
                src={promo.image_url}
                alt={promo.title}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = imgFallback(`promo-${promo.id}`);
                }}
                className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-text/85 via-brand-text/50 to-transparent" />
              <div className="relative flex max-w-xs flex-col justify-center gap-3 p-8">
                {promo.badge && <Badge tone="accent" className="w-fit">{promo.badge}</Badge>}
                <h3 className="font-heading text-2xl font-bold leading-tight text-white">{promo.title}</h3>
                <p className="text-sm leading-relaxed text-brand-tint/90">{promo.subtitle}</p>
                <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-text transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                  Shop the Sale <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {strip && (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-brand-bg px-8 py-6 sm:flex-row">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
              <BadgePercent className="h-6 w-6" />
            </span>
            <div>
              <p className="font-heading text-lg font-bold text-brand-text">{stripTitle}</p>
              <p className="text-sm text-brand-text/70">{stripSubtitle}</p>
            </div>
          </div>
          <Link
            href={strip.link_url}
            className="inline-flex h-11 cursor-pointer items-center rounded-full bg-accent px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent-dark"
          >
            {strip.badge ? `Claim ${strip.badge}` : "Learn More"}
          </Link>
        </div>
      )}
    </section>
  );
}

const TRUST = [
  { icon: Truck, title: "Free Shipping", desc: "On all orders over ¥80" },
  { icon: RefreshCcw, title: "Easy Returns", desc: "30-day return policy" },
  { icon: ShieldCheck, title: "Secure Payment", desc: "100% protected checkout" },
  { icon: Headphones, title: "24/7 Support", desc: "Dedicated help center" },
];

export function TrustSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <section className="border-t border-gray-100 bg-gray-50/70">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {TRUST.map((item) => (
            <div key={item.title} className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="font-heading text-sm font-bold text-brand-text">{item.title}</p>
                <p className="mt-0.5 text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-brand-text px-8 py-10 text-center">
          <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
            Join the NCWU StyleHub Club
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-brand-tint/80">
            Subscribe for exclusive offers, early access to new drops and 10% off your first order.
          </p>
          {subscribed ? (
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-secondary/20 px-6 py-3 text-sm font-semibold text-white">
              Thanks for subscribing! Check your inbox.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setSubscribed(true);
              }}
              className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                aria-label="Email address"
                className="h-12 flex-1 rounded-full border border-white/20 bg-white/10 px-5 text-sm text-white placeholder:text-brand-tint/60 focus:border-secondary focus:outline-none"
              />
              <button
                type="submit"
                className="h-12 cursor-pointer rounded-full bg-accent px-7 text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent-dark"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
