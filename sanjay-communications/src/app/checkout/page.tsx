"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/lib/cart-store";
import { formatINR } from "@/lib/constants";
import toast from "react-hot-toast";
import Script from "next/script";

type Address = {
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
};

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const items = useCart((s) => s.items);
  const total = useCart((s) => s.total());
  const clear = useCart((s) => s.clear);

  const [address, setAddress] = useState<Address>({
    name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "",
  });
  const [method, setMethod] = useState<"razorpay" | "cod">("razorpay");
  const [loading, setLoading] = useState(false);

  const shippingFee = total >= 999 ? 0 : 60;
  const grandTotal = total + shippingFee;

  useEffect(() => {
    if (status === "unauthenticated")
      router.replace(`/login?next=/checkout`);
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      setAddress((a) => ({
        ...a,
        name: a.name || (session.user?.name ?? ""),
        phone: a.phone || ((session.user as any)?.phone ?? ""),
      }));
    }
  }, [session]);

  if (items.length === 0) {
    return (
      <section className="container-page py-24 text-center">
        <h1 className="h-display text-3xl sm:text-5xl">Nothing to checkout.</h1>
        <p className="mt-4 text-ink-soft">Add something to your bag first.</p>
      </section>
    );
  }

  const placeOrder = async () => {
    for (const k of ["name", "phone", "line1", "city", "state", "pincode"] as const) {
      if (!address[k]) return toast.error(`Please enter ${k}`);
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            image: i.image,
            price: i.price,
            quantity: i.quantity,
          })),
          address,
          paymentMethod: method,
          shippingFee,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create order");

      if (data.paymentMethod === "cod") {
        clear();
        toast.success("Order placed!");
        router.push(`/orders/${data.orderId}/confirmation`);
        return;
      }

      // Razorpay
      const options = {
        key: data.keyId,
        amount: data.amount * 100,
        currency: data.currency,
        name: "Sanjay Communications",
        description: "Order payment",
        order_id: data.razorpayOrderId,
        handler: async (resp: any) => {
          const verify = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: data.orderId,
              razorpayPaymentId: resp.razorpay_payment_id,
              razorpayOrderId: resp.razorpay_order_id,
              razorpaySignature: resp.razorpay_signature,
            }),
          });
          const v = await verify.json();
          if (v.ok) {
            clear();
            toast.success("Payment successful!");
            router.push(`/orders/${data.orderId}/confirmation`);
          } else {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: address.name,
          contact: address.phone,
          email: session?.user?.email || "",
        },
        theme: { color: "#0071e3" },
      };
      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <section className="container-page py-12 sm:py-16">
        <h1 className="h-display text-3xl sm:text-5xl mb-10">Checkout.</h1>

        <div className="grid lg:grid-cols-[1fr_380px] gap-10">
          <div className="space-y-8">
            <Card title="Delivery address">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Full name" value={address.name} onChange={(v) => setAddress({ ...address, name: v })} />
                <Input label="Phone" value={address.phone} onChange={(v) => setAddress({ ...address, phone: v })} />
                <div className="sm:col-span-2">
                  <Input label="Address line 1" value={address.line1} onChange={(v) => setAddress({ ...address, line1: v })} />
                </div>
                <div className="sm:col-span-2">
                  <Input label="Address line 2 (optional)" value={address.line2} onChange={(v) => setAddress({ ...address, line2: v })} />
                </div>
                <Input label="City" value={address.city} onChange={(v) => setAddress({ ...address, city: v })} />
                <Input label="State" value={address.state} onChange={(v) => setAddress({ ...address, state: v })} />
                <Input label="Pincode" value={address.pincode} onChange={(v) => setAddress({ ...address, pincode: v })} />
              </div>
            </Card>

            <Card title="Payment">
              <div className="space-y-3">
                <Method
                  active={method === "razorpay"}
                  onClick={() => setMethod("razorpay")}
                  title="Pay online (Razorpay)"
                  sub="Cards, UPI, Net banking, Wallets — all secured."
                />
                <Method
                  active={method === "cod"}
                  onClick={() => setMethod("cod")}
                  title="Cash on delivery"
                  sub="Pay in cash when your order arrives."
                />
              </div>
            </Card>
          </div>

          <aside className="self-start lg:sticky lg:top-24 rounded-3xl bg-bg-subtle p-7">
            <h2 className="text-[16px] font-semibold mb-5">Your order</h2>
            <ul className="space-y-3 text-[13.5px] mb-5">
              {items.map((i) => (
                <li key={i.productId} className="flex justify-between">
                  <span className="text-ink-soft truncate pr-3">
                    {i.name} × {i.quantity}
                  </span>
                  <span>{formatINR(i.price * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="space-y-2 text-[14px] border-t border-line/70 pt-4">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd>{formatINR(total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Shipping</dt>
                <dd>{shippingFee === 0 ? "Free" : formatINR(shippingFee)}</dd>
              </div>
              <div className="border-t border-line/70 pt-3 flex justify-between font-semibold text-[16px]">
                <dt>Total</dt>
                <dd>{formatINR(grandTotal)}</dd>
              </div>
            </dl>
            <button
              onClick={placeOrder}
              disabled={loading}
              className="btn-primary w-full mt-7 disabled:opacity-50"
            >
              {loading ? "Placing…" : method === "cod" ? "Place order" : `Pay ${formatINR(grandTotal)}`}
            </button>
          </aside>
        </div>
      </section>
    </>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-line/70 p-7">
      <h2 className="text-[16px] font-semibold mb-5">{title}</h2>
      {children}
    </div>
  );
}

function Input({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="block text-[12px] text-ink-mute mb-1.5">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-line focus:outline-none focus:border-accent text-[14px]"
      />
    </label>
  );
}

function Method({
  active, onClick, title, sub,
}: { active: boolean; onClick: () => void; title: string; sub: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-5 rounded-2xl border transition-all ${
        active ? "border-accent bg-accent/5" : "border-line hover:border-ink/40"
      }`}
    >
      <p className="font-medium text-[14.5px]">{title}</p>
      <p className="mt-1 text-[13px] text-ink-mute">{sub}</p>
    </button>
  );
}
