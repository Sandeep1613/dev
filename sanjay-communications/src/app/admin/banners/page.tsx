"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Plus, Trash2, X } from "lucide-react";

type Banner = {
  _id?: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  position: number;
};

const empty: Banner = {
  title: "", subtitle: "", image: "", ctaText: "Shop now",
  ctaLink: "/products", isActive: true, position: 0,
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/admin/banners");
    const d = await r.json();
    setBanners(d.banners || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.title || !editing.image) return toast.error("Title and image required");
    const isNew = !editing._id;
    const r = await fetch("/api/admin/banners", {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isNew ? editing : { ...editing, id: editing._id }),
    });
    if (r.ok) {
      toast.success(isNew ? "Created" : "Updated");
      setEditing(null);
      load();
    } else toast.error("Failed");
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    const r = await fetch("/api/admin/banners", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (r.ok) { toast.success("Deleted"); load(); }
  };

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const fd = new FormData();
    fd.append("file", file);
    const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const d = await r.json();
    if (r.ok && d.url) setEditing({ ...editing, image: d.url });
    else toast.error(d.error || "Upload failed");
    e.target.value = "";
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="h-display text-3xl sm:text-4xl">Banners</h1>
        <button onClick={() => setEditing({ ...empty })} className="btn-primary inline-flex">
          <Plus size={16} className="mr-1" /> New banner
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-ink-mute">Loading…</div>
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-3xl border border-line/70 p-12 text-center text-ink-mute">
          No banners yet.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {banners.map((b) => (
            <article
              key={b._id}
              className="bg-white rounded-3xl border border-line/70 overflow-hidden"
            >
              <div className="relative aspect-[16/9] bg-bg-subtle">
                {b.image && <Image src={b.image} alt="" fill className="object-cover" />}
                <span
                  className={`absolute top-3 left-3 text-[10px] px-2 py-1 rounded-full ${
                    b.isActive ? "bg-green-600 text-white" : "bg-ink-mute text-white"
                  }`}
                >
                  {b.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="p-5">
                <p className="text-[11px] text-ink-mute">{b.subtitle}</p>
                <h3 className="font-semibold text-[15px]">{b.title}</h3>
                <p className="mt-1 text-[12px] text-ink-mute">→ {b.ctaLink}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setEditing(b)}
                    className="text-[12px] px-3 py-1.5 rounded-full border border-line hover:border-ink"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(b._id)}
                    className="text-[12px] px-3 py-1.5 rounded-full text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={12} className="inline mr-1" /> Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm p-5">
          <div className="bg-white rounded-3xl w-full max-w-lg p-7 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[16px] font-semibold">
                {editing._id ? "Edit banner" : "New banner"}
              </h2>
              <button onClick={() => setEditing(null)}><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <Inp label="Title" v={editing.title} on={(v) => setEditing({ ...editing, title: v })} />
              <Inp label="Subtitle" v={editing.subtitle} on={(v) => setEditing({ ...editing, subtitle: v })} />
              <Inp label="Image URL" v={editing.image} on={(v) => setEditing({ ...editing, image: v })} />
              <label className="block text-[12px] text-ink-mute">
                Or upload:
                <input type="file" accept="image/*" onChange={upload} className="block mt-1 text-[13px]" />
              </label>
              {editing.image && (
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-bg-subtle">
                  <Image src={editing.image} alt="" fill className="object-cover" />
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-3">
                <Inp label="CTA text" v={editing.ctaText} on={(v) => setEditing({ ...editing, ctaText: v })} />
                <Inp label="CTA link" v={editing.ctaLink} on={(v) => setEditing({ ...editing, ctaLink: v })} />
              </div>
              <div className="grid sm:grid-cols-2 gap-3 items-end">
                <Inp
                  label="Position"
                  v={String(editing.position)}
                  on={(v) => setEditing({ ...editing, position: Number(v) })}
                  type="number"
                />
                <label className="inline-flex items-center gap-2 cursor-pointer pb-1.5">
                  <input
                    type="checkbox"
                    checked={editing.isActive}
                    onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                  />
                  <span className="text-[13px]">Active</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
              <button onClick={save} className="btn-primary">Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Inp({
  label, v, on, type = "text",
}: { label: string; v: string; on: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="block text-[12px] text-ink-mute mb-1.5">{label}</span>
      <input
        type={type}
        value={v}
        onChange={(e) => on(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-line text-[14px] focus:outline-none focus:border-accent"
      />
    </label>
  );
}
