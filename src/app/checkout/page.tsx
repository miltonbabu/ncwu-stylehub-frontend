"use client";

import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import type { Order } from "@/lib/types";
import { cn, formatPrice, FREE_SHIPPING_THRESHOLD, shippingFor } from "@/lib/utils";
import { BadgeCheck, Banknote, QrCode, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PAYMENT_METHODS = [
  { id: "alipay", label: "Alipay", icon: Wallet, desc: "Pay with your Alipay account (支付宝)" },
  { id: "wechat", label: "WeChat Pay", icon: QrCode, desc: "Pay with WeChat Pay (微信支付)" },
  { id: "cod", label: "Cash on Delivery", icon: Banknote, desc: "Pay when you receive the order (货到付款)" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const { items, subtotal, clear, ready: cartReady } = useCart();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [payment, setPayment] = useState("alipay");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState<Order | null>(null);

  useEffect(() => {
    if (ready && !user) {
      router.replace("/auth/sign-in?next=/checkout");
    }
    if (user && !name) setName(user.name);
  }, [ready, user, router, name]);

  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const order = await api<Order>("/orders", {
        method: "POST",
        body: JSON.stringify({
          shipping_name: name,
          shipping_address: address,
          shipping_phone: phone,
          payment_method: payment,
          items: items.map((l) => ({ product_id: l.product.id, quantity: l.quantity })),
        }),
      });
      setPlaced(order);
      clear();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (placed) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-soft text-primary">
          <BadgeCheck className="h-10 w-10" />
        </span>
        <h1 className="mt-6 font-heading text-3xl font-bold text-brand-text">Order Confirmed!</h1>
        <p className="mt-3 text-gray-600">
          Thank you, {placed.shipping_name}. Your order <span className="font-semibold">#{placed.id}</span>{" "}
          for <span className="font-semibold">{formatPrice(placed.total)}</span> has been placed successfully.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" onClick={() => router.push(`/orders/${placed.id}`)}>
            View Order
          </Button>
          <Button size="lg" variant="outline" onClick={() => router.push("/shop")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  if (!ready || !cartReady || !user) {
    return (
      <div className="mx-auto max-w-4xl animate-pulse px-4 py-16">
        <div className="h-96 rounded-3xl bg-gray-100" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-bold text-brand-text">Nothing to check out</h1>
        <p className="mt-2 text-gray-500">Your cart is empty.</p>
        <Button className="mt-6" onClick={() => router.push("/shop")}>
          Go to Shop
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-brand-text">Checkout</h1>
      <p className="mt-1 text-gray-500">Complete your shipping and payment details.</p>

      <form onSubmit={placeOrder} className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-gray-100 bg-white p-6">
            <h2 className="font-heading text-lg font-bold text-brand-text">1. Shipping Information</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" htmlFor="co-name">
                <Input id="co-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
              </Field>
              <Field label="Phone Number" htmlFor="co-phone">
                <Input id="co-phone" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+86 138 0000 0000" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Shipping Address" htmlFor="co-address">
                  <Textarea
                    id="co-address"
                    required
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, city, province, postal code"
                  />
                </Field>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-6">
            <h2 className="font-heading text-lg font-bold text-brand-text">2. Payment Method</h2>
            <div className="mt-5 space-y-3">
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors duration-200",
                    payment === method.id
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-primary/40",
                  )}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={payment === method.id}
                    onChange={() => setPayment(method.id)}
                    className="h-4 w-4 accent-primary"
                  />
                  <method.icon className="h-5 w-5 text-primary" aria-hidden />
                  <div>
                    <p className="text-sm font-semibold text-brand-text">{method.label}</p>
                    <p className="text-xs text-gray-500">{method.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-gray-100 bg-gray-50/70 p-6">
          <h2 className="font-heading text-lg font-bold text-brand-text">Order Summary</h2>
          <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="line-clamp-1 text-gray-600">
                  {product.name} <span className="text-gray-400">× {quantity}</span>
                </span>
                <span className="shrink-0 font-semibold text-brand-text">
                  {formatPrice(product.price * quantity)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-3 border-t border-gray-200 pt-4 text-sm">
            <div className="flex justify-between text-gray-600">
              <dt>Subtotal</dt>
              <dd className="font-semibold text-brand-text">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-gray-600">
              <dt>Shipping</dt>
              <dd className="font-semibold text-brand-text">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
            </div>
            {subtotal < FREE_SHIPPING_THRESHOLD && (
              <p className="rounded-lg bg-primary/10 px-3 py-2 text-xs text-primary">
                Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}.
              </p>
            )}
            <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold text-brand-text">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          <Button type="submit" size="lg" loading={submitting} className="mt-6 w-full">
            Place Order — {formatPrice(total)}
          </Button>
          <p className="mt-3 text-center text-xs text-gray-400">
            By placing your order you agree to our terms of service.
          </p>
          <Link href="/cart" className="mt-2 block text-center text-sm text-primary hover:underline">
            Back to Cart
          </Link>
        </aside>
      </form>
    </div>
  );
}
