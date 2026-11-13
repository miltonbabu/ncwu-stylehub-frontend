"use client";

import { getSeasonalPromo } from "@/lib/seasonal";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Truck } from "lucide-react";

export function AnnouncementBar() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  const promo = getSeasonalPromo();

  return (
    <div className="bg-brand-text text-white">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center gap-6 px-4 text-xs font-medium sm:gap-10">
        <span className="inline-flex items-center gap-1.5">
          <Truck className="h-3.5 w-3.5" aria-hidden />
          Free shipping on orders over ¥80
        </span>
        <span className="hidden items-center gap-1.5 sm:inline-flex">
          <Sparkles className="h-3.5 w-3.5 text-gold" aria-hidden />
          {promo.title}.
          <Link href="/shop" className="underline underline-offset-2 hover:text-gold">
            Shop now
          </Link>
        </span>
      </div>
    </div>
  );
}
