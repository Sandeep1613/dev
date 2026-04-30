import Link from "next/link";
import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db";
import { Order } from "@/models/Order";
import { formatINR } from "@/lib/constants";
import { CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ConfirmationPage({ params }: { params: { id: string } }) {
  await dbConnect();
  const order = JSON.parse(JSON.stringify(await Order.findById(params.id).lean()));
  if (!order) return notFound();

  return (
    <section className="container-page py-16 text-center max-w-2xl">
      <CheckCircle2 size={56} className="text-green-600 mx-auto mb-6" strokeWidth={1.5} />
      <h1 className="h-display text-3xl sm:text-5xl">Thank you!</h1>
      <p className="mt-4 text-ink-soft">
        Your order <span className="font-medium text-ink">#{String(order._id).slice(-8).toUpperCase()}</span>{" "}
        has been placed successfully.
      </p>

      <div className="mt-10 text-left rounded-3xl bg-bg-subtle p-7">
        <h2 className="text-[15px] font-semibold mb-4">Summary</h2>
        <ul className="space-y-2 text-[13.5px] mb-4">
          {order.items.map((i: any, idx: number) => (
            <li key={idx} className="flex justify-between">
              <span className="text-ink-soft truncate pr-3">{i.name} × {i.quantity}</span>
              <span>{formatINR(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-line/70 pt-3 flex justify-between font-semibold text-[15px]">
          <span>Total</span>
          <span>{formatINR(order.total)}</span>
        </div>
        <div className="mt-4 text-[13px] text-ink-mute">
          Payment: <span className="text-ink">{order.paymentMethod === "cod" ? "Cash on delivery" : "Razorpay"}</span> ·{" "}
          Status: <span className="text-ink capitalize">{order.paymentStatus}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/orders" className="btn-dark">View my orders</Link>
        <Link href="/products" className="btn-ghost">Continue shopping</Link>
      </div>
    </section>
  );
}
