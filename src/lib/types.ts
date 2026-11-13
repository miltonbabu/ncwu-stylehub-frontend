export interface User {
  id: number;
  name: string;
  email: string;
  role: "customer" | "admin";
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  sort_order: number;
}

export interface ProductImage {
  id: number;
  image_url: string;
  sort_order: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  stock: number;
  category_id: number;
  category_name: string;
  category_slug: string;
  image_url: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  images: ProductImage[];
  avg_rating: number;
  review_count: number;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  user_name: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface OrderItem {
  id: number;
  product_id: number | null;
  product_name: string;
  unit_price: number;
  quantity: number;
  product_image: string;
}

export interface Order {
  id: number;
  user_id: number;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  total: number;
  shipping_name: string;
  shipping_address: string;
  shipping_phone: string;
  payment_method: string;
  created_at: string;
  items: OrderItem[];
  /** Shipping fee included in `total` (0 when free). */
  shipping: number;
}

export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image_url: string;
  link_url: string;
  sort_order: number;
  is_active: boolean;
}

export interface Promotion {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  image_url: string;
  link_url: string;
  position: string;
  is_active: boolean;
}

export interface AdminStats {
  products: number;
  users: number;
  orders: number;
  revenue: number;
  pending_reviews: number;
  low_stock: number;
}

export interface AuthPayload {
  access_token: string;
  token_type: string;
  user: User;
}

export interface CartLine {
  product: Product;
  quantity: number;
}
