"use client";

import type { Banner } from "@/lib/types";
import { cn, imgFallback } from "@/lib/utils";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const FALLBACK_SLIDES: Banner[] = [
  {
    id: 0,
    title: "New Season, New Style",
    subtitle: "Discover the Autumn 2026 collection — fresh silhouettes for every occasion.",
    image_url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=70",
    link_url: "/shop",
    sort_order: 0,
    is_active: true,
  },
  {
    id: 1,
    title: "Up to 40% Off Outerwear",
    subtitle: "Cozy up in coats and jackets at our best seasonal prices.",
    image_url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1600&q=70",
    link_url: "/shop?category=jackets-coats",
    sort_order: 1,
    is_active: true,
  },
  {
    id: 2,
    title: "Step Into Comfort",
    subtitle: "Sneakers and boots designed for every adventure.",
    image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1600&q=70",
    link_url: "/shop?category=shoes",
    sort_order: 2,
    is_active: true,
  },
];

export function HeroCarousel({ banners }: { banners?: Banner[] }) {
  const slides = banners && banners.length > 0 ? banners : FALLBACK_SLIDES;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = setInterval(() => go(1), 5000);
    return () => clearInterval(timer);
  }, [paused, go, slides.length]);

  return (
    <section
      className="relative mx-auto h-[420px] max-w-7xl overflow-hidden rounded-3xl sm:h-[480px] lg:h-[540px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured promotions"
    >
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-in-out",
            i === index ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          aria-hidden={i !== index}
        >
          <img
            src={slide.image_url}
            alt={slide.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = imgFallback(`banner-${slide.id}`);
            }}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-text/80 via-brand-text/40 to-transparent" />
          <div className="absolute inset-y-0 left-0 flex max-w-xl flex-col justify-center gap-4 p-8 sm:p-12 lg:p-16">
            <span className="w-fit rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
              Limited Time
            </span>
            <h1 className="font-heading text-3xl font-bold leading-tight text-white sm:text-5xl">
              {slide.title}
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-brand-tint sm:text-lg">{slide.subtitle}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href={slide.link_url}
                className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full bg-primary px-7 font-semibold text-white transition-colors duration-200 hover:bg-primary-dark"
              >
                Shop Now <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/shop"
                className="inline-flex h-12 cursor-pointer items-center rounded-full border border-white/60 px-7 font-semibold text-white transition-colors duration-200 hover:bg-white/10"
              >
                Browse All
              </Link>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/85 text-brand-text shadow transition-colors hover:bg-white"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/85 text-brand-text shadow transition-colors hover:bg-white"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "h-2 cursor-pointer rounded-full transition-all duration-300",
              i === index ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80",
            )}
          />
        ))}
      </div>
    </section>
  );
}
