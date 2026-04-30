import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Product } from "@/models/Product";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const product = await Product.findById(params.id).lean();
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await dbConnect();
  const body = await req.json();
  const product = await Product.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json({ product });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await dbConnect();
  await Product.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
