"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { formatINR } from "@/lib/constants";

export default function OrdersPage() {
  const { status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login?next=/orders");
    if (status === "authenticated") {
      fetch("/api/orders")
        .then((r) => r.json())
        .then((d) => setOrders(d.orders || []))
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  if (loading)
    return (
      <section className="container-page py-24 text-center text-ink-mute">Loading…</section>
    );

  if (orders.length === 0)
    return (
      <section className="container-page py-24 text-center">
        <h1 className="h-display text-3xl sm:text-5xl">No orders yet.</h1>
        <p className="mt-4 text-ink-soft">When you place an order it will appear here.</p>
        <Link href="/products" className="btn-primary inline-flex mt-8">
          Start shopping
        </Link>
      </section>
    );

  return (
    <section className="container-page py-12 sm:py-16">
      <h1 className="h-display text-3xl sm:text-5xl mb-10">My orders.</h1>
      <div className="space-y-5">
        {orders.map((o) => (
          <article key={o._id} className="rounded-3xl border border-line/70 p-6">
            <header className="flex flex-wrap justify-between gap-3 mb-4">
              <div>
                <p className="text-[12px] text-ink-mute">
                  Order #{String(o._id).slice(-8).toUpperCase()}
                </p>
                <p className="text-[13px] text-ink-mute">
                  Placed {new Date(o.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Pill tone={statusTone(o.orderStatus)} text={o.orderStatus} />
                <Pill tone={paymentTone(o.paymentStatus)} text={`Payment: ${o.paymentStatus}`} />
              </div>
            </header>
            <ul className="text-[13.5px] space-y-1.5 mb-4">
              {o.items.map((i: any, idx: number) => (
                <li key={idx} className="flex justify-between text-ink-soft">
                  <span className="truncate pr-3">{i.name} × {i.quantity}</span>
                  <span>{formatINR(i.price * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-line/70 pt-3">
              <span className="text-[13px] text-ink-mute">
                {o.paymentMethod === "cod" ? "Cash on delivery" : "Razorpay"}
              </span>
              <span className="font-semibold">{formatINR(o.total)}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Pill({ tone, text }: { tone: string; text: string }) {
  return (
    <span
      className={`text-[11px] px-2.5 py-1 rounded-full capitalize ${tone}`}
    >
      {text}
    </span>
  );
}
function statusTone(s: string) {
  switch (s) {
    case "delivered": return "bg-green-50 text-green-700";
    case "shipped": return "bg-blue-50 text-blue-700";
    case "cancelled": return "bg-red-50 text-red-700";
    default: return "bg-bg-subtle text-ink-soft";
  }
}
function paymentTone(s: string) {
  switch (s) {
    case "paid": return "bg-green-50 text-green-700";
    case "failed": return "bg-red-50 text-red-700";
    case "refunded": return "bg-amber-50 text-amber-700";
    default: return "bg-bg-subtle text-ink-soft";
  }
}
