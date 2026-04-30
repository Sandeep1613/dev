import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Order } from "@/models/Order";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin") return null;
  return session;
}

export async function GET() {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await dbConnect();
  const orders = await Order.find({}).sort({ createdAt: -1 }).populate("userId", "name email phone").lean();
  return NextResponse.json({ orders });
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { orderId, orderStatus, paymentStatus } = await req.json();
  await dbConnect();
  const update: any = {};
  if (orderStatus) update.orderStatus = orderStatus;
  if (paymentStatus) update.paymentStatus = paymentStatus;
  const order = await Order.findByIdAndUpdate(orderId, update, { new: true });
  return NextResponse.json({ order });
}
