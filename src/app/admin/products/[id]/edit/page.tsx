"use client";

import { ProductForm } from "@/components/admin/product-form";
import { api } from "@/lib/api";
import type { Product } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api<Product>(`/admin/products/${id}`)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="h-96 animate-pulse rounded-3xl bg-gray-100" />;
  }

  if (!product) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">Product not found.</p>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="mt-4 cursor-pointer font-semibold text-primary hover:underline"
        >
          Back to products
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-brand-text">Edit Product</h1>
        <p className="mt-1 text-sm text-gray-500">Update details for “{product.name}”.</p>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
