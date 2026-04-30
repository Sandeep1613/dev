import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";

export async function GET() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await dbConnect();
  const [userCount, productCount, orderCount, paidOrders] = await Promise.all([
    User.countDocuments({ role: "user" }),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.find({ paymentStatus: "paid" }, { total: 1 }).lean(),
  ]);
  const totalSales = paidOrders.reduce((s: number, o: any) => s + (o.total || 0), 0);

  // Recent orders for chart-ish summary
  const last7 = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
        revenue: { $sum: "$total" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return NextResponse.json({
    stats: {
      totalSales,
      totalOrders: orderCount,
      totalProducts: productCount,
      totalUsers: userCount,
    },
    last7,
  });
}
