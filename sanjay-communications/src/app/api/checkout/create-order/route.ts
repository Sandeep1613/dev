import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Order } from "@/models/Order";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { items, address, paymentMethod, shippingFee = 0 } = await req.json();
  if (!items?.length || !address || !paymentMethod) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await dbConnect();
  const subtotal = items.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
  const total = subtotal + shippingFee;

  const order = await Order.create({
    userId: (session.user as any).id,
    items,
    subtotal,
    shippingFee,
    total,
    address,
    paymentMethod,
    paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
    orderStatus: "placed",
  });

  if (paymentMethod === "cod") {
    return NextResponse.json({ orderId: String(order._id), paymentMethod: "cod" });
  }

  // Razorpay
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    return NextResponse.json({ error: "Payment not configured" }, { status: 500 });
  }
  const rzp = new Razorpay({ key_id, key_secret });
  const rzpOrder = await rzp.orders.create({
    amount: total * 100,
    currency: "INR",
    receipt: String(order._id),
  });

  order.razorpayOrderId = rzpOrder.id;
  await order.save();

  return NextResponse.json({
    orderId: String(order._id),
    razorpayOrderId: rzpOrder.id,
    amount: total,
    currency: "INR",
    keyId: key_id,
  });
}
