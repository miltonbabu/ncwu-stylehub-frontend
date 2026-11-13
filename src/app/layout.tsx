import type { Metadata } from "next";
import { Nunito_Sans, Rubik } from "next/font/google";
import { AnnouncementBar } from "@/components/announcement-bar";
import { MobileTabs } from "@/components/mobile-tabs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WelcomeBanner } from "@/components/welcome-banner";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import "./globals.css";

const rubik = Rubik({ subsets: ["latin"], variable: "--font-rubik", display: "swap" });
const nunito = Nunito_Sans({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });

export const metadata: Metadata = {
  title: "NCWU StyleHub — Modern Clothes Store",
  description:
    "Shop the latest fashion: t-shirts, dresses, jackets, jeans, shoes and accessories. Fast shipping, easy returns and secure checkout.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${rubik.variable} ${nunito.variable}`}>
      <body className="min-h-screen bg-brand-bg font-body text-brand-text antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('stylehub_theme')||'noir';document.documentElement.setAttribute('data-theme',t)}catch(e){}",
          }}
        />
        <AuthProvider>
          <CartProvider>
            <WelcomeBanner />
            <AnnouncementBar />
            <SiteHeader />
            <main className="min-h-[60vh] pb-24 lg:pb-0">{children}</main>
            <SiteFooter />
            <MobileTabs />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
