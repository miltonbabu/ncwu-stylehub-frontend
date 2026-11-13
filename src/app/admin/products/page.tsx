"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { Product } from "@/lib/types";
import { formatPrice, imgFallback } from "@/lib/utils";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = () => {
    api<Product[]>("/admin/products")
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onDelete = async (id: number) => {
    if (!window.confirm("Delete this product permanently?")) return;
    setDeleting(id);
    try {
      await api(`/admin/products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      window.alert("Failed to delete product");
    } finally {
      setDeleting(null);
    }
  };

  const filtered = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-text">Products</h1>
          <p className="mt-1 text-sm text-gray-500">Upload, edit and manage the catalog.</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4" /> Upload Product
          </Button>
        </Link>
      </div>

      <div className="mb-4 relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          aria-label="Search products"
          className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 text-sm focus:border-primary focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
              <th className="px-5 py-4">Product</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">Stock</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-500/5">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={6} className="px-5 py-4">
                    <div className="h-10 animate-pulse rounded bg-gray-100" />
                  </td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr key={product.id} className="transition-colors hover:bg-gray-50/60">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image_url}
                        alt=""
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = imgFallback(`product-${product.id}`);
                        }}
                        className="h-11 w-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold text-brand-text">{product.name}</p>
                        <p className="text-xs text-gray-400">#{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{product.category_name}</td>
                  <td className="px-5 py-3">
                    <p className="font-semibold text-brand-text">{formatPrice(product.price)}</p>
                    {product.compare_at_price && (
                      <p className="text-xs text-gray-400 line-through">{formatPrice(product.compare_at_price)}</p>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <Badge tone={product.stock < 5 ? "red" : product.stock < 20 ? "gold" : "green"}>
                      {product.stock} in stock
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge tone={product.is_active ? "green" : "gray"}>{product.is_active ? "Active" : "Hidden"}</Badge>
                      {product.is_featured && <Badge tone="gold">Featured</Badge>}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <button
                          type="button"
                          className="cursor-pointer rounded-lg border border-gray-200 p-2 text-gray-500 transition-colors hover:border-primary hover:text-primary"
                          aria-label={`Edit ${product.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </Link>
                      <button
                        type="button"
                        disabled={deleting === product.id}
                        onClick={() => onDelete(product.id)}
                        className="cursor-pointer rounded-lg border border-gray-200 p-2 text-gray-500 transition-colors hover:border-red-300 hover:text-red-600 disabled:opacity-50"
                        aria-label={`Delete ${product.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
