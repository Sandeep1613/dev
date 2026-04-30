"use client";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-store";
import { formatINR } from "@/lib/constants";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const total = useCart((s) => s.total());

  if (items.length === 0) {
    return (
      <section className="container-page py-24 text-center">
        <h1 className="h-display text-3xl sm:text-5xl">Your bag is empty.</h1>
        <p className="mt-4 text-ink-soft">Discover what's new and add a few favourites.</p>
        <Link href="/products" className="btn-primary mt-8 inline-flex">
          Continue shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="container-page py-12 sm:py-16">
      <h1 className="h-display text-3xl sm:text-5xl mb-10">Your bag.</h1>

      <div className="grid lg:grid-cols-[1fr_380px] gap-10">
        <div className="space-y-5">
          {items.map((it) => (
            <div
              key={it.productId}
              className="flex gap-5 p-5 rounded-3xl bg-bg-subtle"
            >
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-white shrink-0">
                {it.image && (
                  <Image src={it.image} alt={it.name} fill className="object-contain p-2" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-medium leading-snug line-clamp-2">{it.name}</p>
                <p className="mt-1 text-[13px] text-ink-mute">{formatINR(it.price)} each</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="inline-flex items-center bg-white rounded-full border border-line">
                    <button
                      onClick={() => setQty(it.productId, it.quantity - 1)}
                      className="px-2.5 py-1.5 text-ink-soft"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="px-3 text-[13px] font-medium tabular-nums">
                      {it.quantity}
                    </span>
                    <button
                      onClick={() => setQty(it.productId, it.quantity + 1)}
                      className="px-2.5 py-1.5 text-ink-soft"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-[15px]">
                      {formatINR(it.price * it.quantity)}
                    </span>
                    <button
                      onClick={() => remove(it.productId)}
                      className="text-ink-mute hover:text-red-600"
                      aria-label="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="self-start lg:sticky lg:top-24 rounded-3xl bg-bg-subtle p-7">
          <h2 className="text-[16px] font-semibold mb-5">Summary</h2>
          <dl className="space-y-3 text-[14px]">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Subtotal</dt>
              <dd>{formatINR(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Shipping</dt>
              <dd>{total >= 999 ? "Free" : formatINR(60)}</dd>
            </div>
            <div className="border-t border-line/70 pt-3 flex justify-between font-semibold text-[16px]">
              <dt>Total</dt>
              <dd>{formatINR(total + (total >= 999 ? 0 : 60))}</dd>
            </div>
          </dl>
          <Link href="/checkout" className="btn-primary w-full mt-7">
            Checkout
          </Link>
          <Link href="/products" className="block text-center mt-4 text-[13px] text-accent hover:underline">
            Continue shopping
          </Link>
        </aside>
      </div>
    </section>
  );
}
