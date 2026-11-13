"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Mail, MapPin, Phone, Store } from "lucide-react";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.2-1.5 1.5-1.5h1.5V5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.8 1.4-3.8 3.9V11H8v3h2.5v7h3z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M18.9 2H22l-6.8 7.8L23 22h-6.3l-4.9-6.4L6.1 22H3l7.3-8.3L2 2h6.5l4.4 5.8L18.9 2zm-1.1 18h1.7L7.4 3.8H5.6L17.8 20z" />
    </svg>
  );
}

export function SiteFooter() {
  const pathname = usePathname();
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="mt-16 border-t border-gray-100 bg-brand-text text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <Store className="h-5 w-5 text-white" />
            </span>
            <span className="font-heading text-xl font-bold">
              NCWU <span className="text-secondary">StyleHub</span>
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-brand-tint/80">
            Modern clothes for every occasion. Quality fabrics, honest prices and a shopping
            experience you will love.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="#" aria-label="Facebook" className="rounded-full bg-white/10 p-2.5 transition-colors hover:bg-primary">
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Instagram" className="rounded-full bg-white/10 p-2.5 transition-colors hover:bg-primary">
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a href="#" aria-label="X (Twitter)" className="rounded-full bg-white/10 p-2.5 transition-colors hover:bg-primary">
              <XIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white/90">Shop</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-brand-tint/80">
            <li><Link href="/shop" className="cursor-pointer transition-colors hover:text-white">All Products</Link></li>
            <li><Link href="/shop?category=t-shirts" className="cursor-pointer transition-colors hover:text-white">T-Shirts</Link></li>
            <li><Link href="/shop?category=dresses" className="cursor-pointer transition-colors hover:text-white">Dresses</Link></li>
            <li><Link href="/shop?category=jackets-coats" className="cursor-pointer transition-colors hover:text-white">Jackets &amp; Coats</Link></li>
            <li><Link href="/shop?category=shoes" className="cursor-pointer transition-colors hover:text-white">Shoes</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white/90">Help</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-brand-tint/80">
            <li><Link href="/orders" className="cursor-pointer transition-colors hover:text-white">Order Tracking</Link></li>
            <li><Link href="/account" className="cursor-pointer transition-colors hover:text-white">My Account</Link></li>
            <li><span className="cursor-pointer transition-colors hover:text-white">Shipping &amp; Returns</span></li>
            <li><span className="cursor-pointer transition-colors hover:text-white">FAQ</span></li>
            <li><span className="cursor-pointer transition-colors hover:text-white">Privacy Policy</span></li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white/90">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-brand-tint/80">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
              <span>123 Fashion Avenue, Zhengzhou, Henan, China</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-secondary" />
              <span>+86 138 0000 0000</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-secondary" />
              <span>support@ncwustylehub.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-brand-tint/70 sm:flex-row sm:px-6">
          <p>© {year} NCWU StyleHub. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <span>Alipay</span>
            <span>WeChat Pay</span>
            <span>Cash on Delivery</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
