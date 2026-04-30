import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Product } from "@/models/Product";
import { slugify } from "@/lib/constants";

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const filter = searchParams.get("filter");

  const query: any = {};
  if (category) query.category = category;
  if (q) query.name = { $regex: q, $options: "i" };
  if (filter === "featured") query.isFeatured = true;
  if (filter === "new") query.isNewArrival = true;
  if (filter === "bestseller") query.isBestSeller = true;

  const products = await Product.find(query).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await dbConnect();
  const body = await req.json();
  const slug = body.slug || slugify(body.name + "-" + Date.now().toString(36));
  const product = await Product.create({ ...body, slug });
  return NextResponse.json({ product });
}
