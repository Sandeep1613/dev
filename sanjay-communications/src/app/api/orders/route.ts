import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Order } from "@/models/Order";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await dbConnect();
  const orders = await Order.find({ userId: (session.user as any).id })
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json({ orders });
}
