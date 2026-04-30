import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { dbConnect } from "@/lib/db";
import { Order } from "@/models/Order";

export async function POST(req: NextRequest) {
  const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = await req.json();
  const secret = process.env.RAZORPAY_KEY_SECRET as string;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  await dbConnect();
  const order = await Order.findById(orderId);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  if (expected !== razorpaySignature) {
    order.paymentStatus = "failed";
    await order.save();
    return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 400 });
  }

  order.paymentStatus = "paid";
  order.razorpayPaymentId = razorpayPaymentId;
  order.razorpaySignature = razorpaySignature;
  order.orderStatus = "confirmed";
  await order.save();

  return NextResponse.json({ ok: true, orderId: String(order._id) });
}
