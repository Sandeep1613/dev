import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Banner } from "@/models/Banner";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.role === "admin";
}

export async function GET() {
  await dbConnect();
  const banners = await Banner.find({}).sort({ position: 1 }).lean();
  return NextResponse.json({ banners });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await dbConnect();
  const body = await req.json();
  const banner = await Banner.create(body);
  return NextResponse.json({ banner });
}

export async function PUT(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await dbConnect();
  const { id, ...rest } = await req.json();
  const banner = await Banner.findByIdAndUpdate(id, rest, { new: true });
  return NextResponse.json({ banner });
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await dbConnect();
  const { id } = await req.json();
  await Banner.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
