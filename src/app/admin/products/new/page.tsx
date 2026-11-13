"use client";

import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-brand-text">Upload New Product</h1>
        <p className="mt-1 text-sm text-gray-500">Add a product to the catalog with images and pricing.</p>
      </div>
      <ProductForm />
    </div>
  );
}
