import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";

export async function GET() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await dbConnect();
  const customers = await User.find({ role: "user" }, { passwordHash: 0 })
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json({ customers });
}
