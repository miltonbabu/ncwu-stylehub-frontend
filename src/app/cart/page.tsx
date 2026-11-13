"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { FREE_SHIPPING_THRESHOLD, formatPrice, imgFallback, shippingFor } from "@/lib/utils";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, remove, subtotal, clear, ready } = useCart();
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  if (!ready) {
    return <div className="mx-auto max-w-4xl animate-pulse px-4 py-16"><div className="h-96 rounded-3xl bg-gray-100" /></div>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-soft text-primary">
          <ShoppingBag className="h-9 w-9" />
        </span>
        <h1 className="mt-6 font-heading text-2xl font-bold text-brand-text">Your cart is empty</h1>
        <p className="mt-2 text-gray-500">Looks like you have not added anything yet.</p>
        <Button size="lg" className="mt-6" onClick={() => router.push("/shop")}>
          Start Shopping <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-brand-text">Shopping Cart</h1>
      <p className="mt-1 text-gray-500">
        {items.length} item{items.length === 1 ? "" : "s"} in your cart
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <ul className="space-y-4">
          {items.map(({ product, quantity }) => (
            <li key={product.id} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4">
              <Link href={`/product/${product.id}`} className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                <img
                  src={product.image_url}
                  alt={product.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = imgFallback(`product-${product.id}`);
                  }}
                  className="h-full w-full object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={`/product/${product.id}`} className="font-heading text-sm font-semibold hover:text-primary">
                      {product.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-gray-500">{product.category_name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(product.id)}
                    className="cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label={`Remove ${product.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-gray-200">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="cursor-pointer px-3 py-1.5 text-gray-500 hover:text-primary"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, Math.min(product.stock, quantity + 1))}
                      className="cursor-pointer px-3 py-1.5 text-gray-500 hover:text-primary"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="font-heading font-bold text-brand-text">
                    {formatPrice(product.price * quantity)}
                  </p>
                </div>
              </div>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={clear}
              className="cursor-pointer text-sm text-gray-400 underline-offset-2 hover:text-red-500 hover:underline"
            >
              Clear cart
            </button>
          </li>
        </ul>

        <aside className="h-fit rounded-2xl border border-gray-100 bg-gray-50/70 p-6">
          <h2 className="font-heading text-lg font-bold text-brand-text">Order Summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <dt>Subtotal</dt>
              <dd className="font-semibold text-brand-text">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-gray-600">
              <dt>Shipping</dt>
              <dd className="font-semibold text-brand-text">
                {shipping === 0 ? "Free" : formatPrice(shipping)}
              </dd>
            </div>
            {subtotal < FREE_SHIPPING_THRESHOLD && (
              <p className="rounded-lg bg-primary/10 px-3 py-2 text-xs text-primary">
                Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more to get free shipping!
              </p>
            )}
            <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold text-brand-text">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
          <Button size="lg" className="mt-6 w-full" onClick={() => router.push("/checkout")}>
            Proceed to Checkout <ArrowRight className="h-4 w-4" />
          </Button>
          <Link href="/shop" className="mt-3 block text-center text-sm text-primary hover:underline">
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
