"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CATEGORIES, slugify } from "@/lib/constants";
import toast from "react-hot-toast";
import { X, Upload } from "lucide-react";

type Form = {
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: number;
  discountPrice: number;
  description: string;
  stock: number;
  rating: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  images: string[];
  specifications: Record<string, string>;
};

export function ProductForm({
  initial,
  productId,
}: {
  initial?: Partial<Form>;
  productId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<Form>({
    name: initial?.name || "",
    slug: initial?.slug || "",
    brand: initial?.brand || "",
    category: initial?.category || CATEGORIES[0].slug,
    price: initial?.price || 0,
    discountPrice: initial?.discountPrice || 0,
    description: initial?.description || "",
    stock: initial?.stock || 0,
    rating: initial?.rating || 4.5,
    isFeatured: !!initial?.isFeatured,
    isNewArrival: !!initial?.isNewArrival,
    isBestSeller: !!initial?.isBestSeller,
    images: initial?.images || [],
    specifications: (initial?.specifications as any) || {},
  });
  const [imageInput, setImageInput] = useState("");
  const [specKey, setSpecKey] = useState("");
  const [specVal, setSpecVal] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const addImageUrl = () => {
    if (!imageInput.trim()) return;
    set("images", [...form.images, imageInput.trim()]);
    setImageInput("");
  };

  const removeImage = (i: number) =>
    set("images", form.images.filter((_, idx) => idx !== i));

  const onFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const d = await r.json();
        if (r.ok && d.url) uploaded.push(d.url);
        else toast.error(d.error || "Upload failed");
      }
      if (uploaded.length) {
        set("images", [...form.images, ...uploaded]);
        toast.success(`${uploaded.length} image(s) uploaded`);
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const addSpec = () => {
    if (!specKey.trim() || !specVal.trim()) return;
    set("specifications", { ...form.specifications, [specKey.trim()]: specVal.trim() });
    setSpecKey("");
    setSpecVal("");
  };
  const removeSpec = (k: string) => {
    const { [k]: _, ...rest } = form.specifications;
    set("specifications", rest);
  };

  const submit = async () => {
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.price || form.price <= 0) return toast.error("Price must be > 0");
    if (form.images.length === 0) return toast.error("Add at least one image");

    setSaving(true);
    try {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.name),
      };
      const url = productId ? `/api/products/${productId}` : "/api/products";
      const method = productId ? "PUT" : "POST";
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Save failed");
      toast.success(productId ? "Updated" : "Created");
      router.push("/admin/products");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="bg-white rounded-3xl border border-line/70 p-7 space-y-4">
        <h2 className="text-[15px] font-semibold">Basics</h2>
        <Field label="Name" value={form.name} onChange={(v) => set("name", v)} />
        <Field
          label="Slug (optional, auto-generated)"
          value={form.slug}
          onChange={(v) => set("slug", v)}
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Brand" value={form.brand} onChange={(v) => set("brand", v)} />
          <label className="block">
            <span className="block text-[12px] text-ink-mute mb-1.5">Category</span>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-line bg-white text-[14px]"
            >
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field
            label="Price (₹)"
            type="number"
            value={String(form.price)}
            onChange={(v) => set("price", Number(v))}
          />
          <Field
            label="Discount price (₹)"
            type="number"
            value={String(form.discountPrice)}
            onChange={(v) => set("discountPrice", Number(v))}
          />
          <Field
            label="Stock"
            type="number"
            value={String(form.stock)}
            onChange={(v) => set("stock", Number(v))}
          />
        </div>
        <label className="block">
          <span className="block text-[12px] text-ink-mute mb-1.5">Description</span>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-line text-[14px] focus:outline-none focus:border-accent"
          />
        </label>
        <div className="flex flex-wrap gap-4 pt-2">
          <Toggle label="Featured" v={form.isFeatured} onV={(v) => set("isFeatured", v)} />
          <Toggle label="New arrival" v={form.isNewArrival} onV={(v) => set("isNewArrival", v)} />
          <Toggle label="Best seller" v={form.isBestSeller} onV={(v) => set("isBestSeller", v)} />
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-3xl border border-line/70 p-7 space-y-4">
        <h2 className="text-[15px] font-semibold">Images</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {form.images.map((src, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-bg-subtle group">
              <Image src={src} alt="" fill className="object-cover" />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <label className="aspect-square rounded-xl border-2 border-dashed border-line flex flex-col items-center justify-center text-ink-mute hover:border-ink/40 cursor-pointer text-[11px] gap-1">
            <Upload size={16} />
            <span>{uploading ? "Uploading…" : "Upload"}</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={onFileUpload}
              disabled={uploading}
            />
          </label>
        </div>

        <div className="flex gap-2 pt-2">
          <input
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            placeholder="Or paste an image URL"
            className="flex-1 px-4 py-2.5 rounded-xl border border-line text-[13.5px]"
          />
          <button onClick={addImageUrl} className="btn-dark text-[13px]">Add URL</button>
        </div>
      </div>

      {/* Specs */}
      <div className="bg-white rounded-3xl border border-line/70 p-7 space-y-4">
        <h2 className="text-[15px] font-semibold">Specifications</h2>
        {Object.entries(form.specifications).length > 0 && (
          <div className="space-y-1.5">
            {Object.entries(form.specifications).map(([k, v]) => (
              <div key={k} className="flex items-center gap-3 text-[13px] py-2 border-b border-line/60">
                <span className="text-ink-mute w-32 shrink-0">{k}</span>
                <span className="flex-1">{v}</span>
                <button onClick={() => removeSpec(k)} className="text-ink-mute hover:text-red-600">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-2">
          <input
            value={specKey}
            onChange={(e) => setSpecKey(e.target.value)}
            placeholder="Key (e.g. RAM)"
            className="px-4 py-2.5 rounded-xl border border-line text-[13.5px]"
          />
          <input
            value={specVal}
            onChange={(e) => setSpecVal(e.target.value)}
            placeholder="Value (e.g. 8GB)"
            className="px-4 py-2.5 rounded-xl border border-line text-[13.5px]"
          />
          <button onClick={addSpec} className="btn-dark text-[13px]">Add</button>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => router.back()}
          className="btn-ghost"
        >
          Cancel
        </button>
        <button onClick={submit} disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? "Saving…" : productId ? "Update product" : "Create product"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text",
}: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="block text-[12px] text-ink-mute mb-1.5">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-line text-[14px] focus:outline-none focus:border-accent"
      />
    </label>
  );
}

function Toggle({ label, v, onV }: { label: string; v: boolean; onV: (v: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={v} onChange={(e) => onV(e.target.checked)} className="sr-only peer" />
      <span className="w-9 h-5 rounded-full bg-line peer-checked:bg-accent transition-colors relative">
        <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:[transform:translateX(16px)]" />
      </span>
      <span className="text-[13px]">{label}</span>
    </label>
  );
}
