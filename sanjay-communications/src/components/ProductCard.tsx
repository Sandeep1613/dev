"use client";
import Link from "next/link";
import Image from "next/image";
import { formatINR } from "@/lib/constants";

export type ProductCardData = {
  _id: string;
  name: string;
  slug: string;
  brand?: string;
  price: number;
  discountPrice?: number;
  images: string[];
  rating?: number;
  category: string;
  stock: number;
};

export function ProductCard({ p, accent }: { p: ProductCardData; accent?: boolean }) {
  const final = p.discountPrice && p.discountPrice > 0 ? p.discountPrice : p.price;
  const hasDiscount = p.discountPrice && p.discountPrice > 0 && p.discountPrice < p.price;
  const off = hasDiscount ? Math.round(((p.price - (p.discountPrice as number)) / p.price) * 100) : 0;

  return (
    <Link
      href={`/product/${p.slug}`}
      className={`card-product group block ${
        accent ? "bg-gradient-to-b from-bg-subtle to-white" : ""
      }`}
    >
      <div className="aspect-[4/5] relative overflow-hidden">
        {p.images?.[0] ? (
          <Image
            src={p.images[0]}
            alt={p.name}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-ink-mute">
            No image
          </div>
        )}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-ink text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
            {off}% off
          </span>
        )}
        {p.stock <= 0 && (
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-ink text-[10px] font-medium px-2.5 py-1 rounded-full">
            Sold out
          </span>
        )}
      </div>
      <div className="p-4 sm:p-5">
        <p className="text-[11px] text-ink-mute mb-1.5">{p.brand || "—"}</p>
        <h3 className="text-[14px] sm:text-[15px] font-medium leading-snug line-clamp-2 min-h-[40px]">
          {p.name}
        </h3>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-[15px] font-semibold">{formatINR(final)}</span>
          {hasDiscount && (
            <span className="text-[12px] text-ink-mute line-through">{formatINR(p.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
