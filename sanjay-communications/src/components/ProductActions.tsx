"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";

export function ProductActions({
  product,
}: {
  product: { _id: string; name: string; image: string; price: number; stock: number };
}) {
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);
  const router = useRouter();

  const inStock = product.stock > 0;

  const onAdd = () => {
    if (!inStock) return toast.error("Out of stock");
    add({
      productId: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: qty,
      stock: product.stock,
    });
    toast.success("Added to cart");
  };

  const onBuy = () => {
    if (!inStock) return toast.error("Out of stock");
    add({
      productId: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: qty,
      stock: product.stock,
    });
    router.push("/checkout");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-[13px] text-ink-mute">Quantity</span>
        <div className="inline-flex items-center border border-line rounded-full">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-2 text-ink-soft hover:text-ink"
            aria-label="Decrease"
          >
            <Minus size={14} />
          </button>
          <span className="px-4 text-[14px] font-medium tabular-nums">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            className="px-3 py-2 text-ink-soft hover:text-ink"
            aria-label="Increase"
          >
            <Plus size={14} />
          </button>
        </div>
        <span
          className={`text-[12px] ${inStock ? "text-green-700" : "text-red-600"}`}
        >
          {inStock ? `In stock · ${product.stock} left` : "Out of stock"}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={onBuy} disabled={!inStock} className="btn-primary flex-1 disabled:opacity-50">
          Buy now
        </button>
        <button onClick={onAdd} disabled={!inStock} className="btn-ghost flex-1 disabled:opacity-50">
          Add to cart
        </button>
      </div>
    </div>
  );
}
