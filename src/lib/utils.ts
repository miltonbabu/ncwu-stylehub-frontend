export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" }).format(value);
}

export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

const PAYMENT_LABELS: Record<string, string> = {
  alipay: "Alipay",
  wechat: "WeChat Pay",
  cod: "Cash on Delivery",
  card: "Credit / Debit Card",
  paypal: "PayPal",
};

export function paymentLabel(id: string): string {
  return PAYMENT_LABELS[id] ?? id.replace(/-/g, " ");
}

export const FREE_SHIPPING_THRESHOLD = 80;

export function shippingFor(subtotal: number): number {
  return subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 6.9;
}

/** Image fallback chain: product/CDN image -> deterministic placeholder. */
export function imgFallback(seed: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/900/1100`;
}
