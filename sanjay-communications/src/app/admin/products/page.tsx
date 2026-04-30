"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { formatINR, CATEGORIES } from "@/lib/constants";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/products");
    const d = await r.json();
    setProducts(d.products || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const r = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (r.ok) { toast.success("Deleted"); load(); }
    else toast.error("Failed");
  };

  const filtered = filter
    ? products.filter((p) => p.category === filter)
    : products;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="h-display text-3xl sm:text-4xl">Products</h1>
        <Link href="/admin/products/new" className="btn-primary inline-flex">
          <Plus size={16} className="mr-1" /> Add product
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
        <button
          onClick={() => setFilter("")}
          className={`shrink-0 px-3 py-1.5 rounded-full text-[12.5px] border ${
            !filter ? "bg-ink text-white border-ink" : "border-line bg-white"
          }`}
        >
          All ({products.length})
        </button>
        {CATEGORIES.map((c) => {
          const count = products.filter((p) => p.category === c.slug).length;
          return (
            <button
              key={c.slug}
              onClick={() => setFilter(c.slug)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[12.5px] border ${
                filter === c.slug ? "bg-ink text-white border-ink" : "border-line bg-white"
              }`}
            >
              {c.name.replace("Latest ", "")} ({count})
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl border border-line/70 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-ink-mute">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-ink-mute">No products.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13.5px]">
              <thead className="bg-bg-subtle text-ink-mute text-[12px] uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3">Product</th>
                  <th className="text-left px-5 py-3 hidden md:table-cell">Category</th>
                  <th className="text-left px-5 py-3">Price</th>
                  <th className="text-left px-5 py-3 hidden sm:table-cell">Stock</th>
                  <th className="text-right px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id} className="border-t border-line/60">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-bg-subtle shrink-0">
                          {p.images?.[0] && (
                            <Image src={p.images[0]} alt="" fill className="object-cover" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate max-w-[220px]">{p.name}</p>
                          <p className="text-[11px] text-ink-mute">{p.brand || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell capitalize text-ink-soft">
                      {p.category.replace(/-/g, " ")}
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-medium">
                        {formatINR(p.discountPrice > 0 ? p.discountPrice : p.price)}
                      </span>
                      {p.discountPrice > 0 && (
                        <span className="ml-2 text-ink-mute line-through text-[11px]">
                          {formatINR(p.price)}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span className={p.stock > 0 ? "text-green-700" : "text-red-600"}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/products/${p._id}`}
                          className="p-2 rounded-lg hover:bg-bg-subtle text-ink-soft"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => remove(p._id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
