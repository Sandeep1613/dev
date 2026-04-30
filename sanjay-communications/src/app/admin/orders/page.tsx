"use client";
import { useEffect, useState } from "react";
import { formatINR } from "@/lib/constants";
import toast from "react-hot-toast";
import { ChevronDown, ChevronUp } from "lucide-react";

const ORDER_STATUSES = ["placed", "confirmed", "shipped", "delivered", "cancelled"] as const;
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"] as const;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/admin/orders");
    const d = await r.json();
    setOrders(d.orders || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const update = async (
    orderId: string,
    field: "orderStatus" | "paymentStatus",
    value: string
  ) => {
    const r = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, [field]: value }),
    });
    if (r.ok) {
      toast.success("Updated");
      load();
    } else toast.error("Failed");
  };

  return (
    <>
      <h1 className="h-display text-3xl sm:text-4xl mb-8">Orders</h1>

      {loading ? (
        <div className="text-center py-12 text-ink-mute">Loading…</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-line/70 p-12 text-center text-ink-mute">
          No orders yet.
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            const isOpen = expanded === o._id;
            return (
              <div
                key={o._id}
                className="bg-white rounded-3xl border border-line/70 overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : o._id)}
                  className="w-full text-left p-5 flex flex-wrap items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold">
                      #{String(o._id).slice(-8).toUpperCase()}
                    </p>
                    <p className="text-[12px] text-ink-mute">
                      {o.userId?.name || "Guest"} · {o.userId?.email || o.userId?.phone || "—"}
                    </p>
                  </div>
                  <span className="text-[12px] text-ink-mute">
                    {new Date(o.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </span>
                  <span className="font-semibold text-[14px]">{formatINR(o.total)}</span>
                  <span className={`text-[11px] px-2.5 py-1 rounded-full capitalize ${tone(o.orderStatus)}`}>
                    {o.orderStatus}
                  </span>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 border-t border-line/60 pt-5 grid lg:grid-cols-[1fr_280px] gap-6">
                    <div>
                      <h3 className="text-[12px] uppercase tracking-wide text-ink-mute mb-2">Items</h3>
                      <ul className="text-[13.5px] space-y-1.5 mb-4">
                        {o.items.map((i: any, idx: number) => (
                          <li key={idx} className="flex justify-between">
                            <span className="text-ink-soft truncate pr-3">
                              {i.name} × {i.quantity}
                            </span>
                            <span>{formatINR(i.price * i.quantity)}</span>
                          </li>
                        ))}
                      </ul>
                      <h3 className="text-[12px] uppercase tracking-wide text-ink-mute mt-5 mb-2">Address</h3>
                      <p className="text-[13px] text-ink-soft leading-relaxed">
                        {o.address?.name} · {o.address?.phone}<br />
                        {o.address?.line1}{o.address?.line2 ? `, ${o.address.line2}` : ""}<br />
                        {o.address?.city}, {o.address?.state} {o.address?.pincode}
                      </p>
                      <p className="mt-3 text-[12px] text-ink-mute">
                        Method: <span className="text-ink capitalize">{o.paymentMethod}</span>
                        {o.razorpayPaymentId && (
                          <> · Payment ID: <span className="text-ink">{o.razorpayPaymentId}</span></>
                        )}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <label className="block">
                        <span className="block text-[11px] text-ink-mute mb-1.5">Order status</span>
                        <select
                          value={o.orderStatus}
                          onChange={(e) => update(o._id, "orderStatus", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-line text-[13px] bg-white capitalize"
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="block text-[11px] text-ink-mute mb-1.5">Payment status</span>
                        <select
                          value={o.paymentStatus}
                          onChange={(e) => update(o._id, "paymentStatus", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-line text-[13px] bg-white capitalize"
                        >
                          {PAYMENT_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function tone(s: string) {
  switch (s) {
    case "delivered": return "bg-green-50 text-green-700";
    case "shipped": return "bg-blue-50 text-blue-700";
    case "confirmed": return "bg-indigo-50 text-indigo-700";
    case "cancelled": return "bg-red-50 text-red-700";
    default: return "bg-bg-subtle text-ink-soft";
  }
}
