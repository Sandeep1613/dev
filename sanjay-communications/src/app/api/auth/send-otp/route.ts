import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Otp } from "@/models/Banner";

export async function POST(req: NextRequest) {
  const { phone } = await req.json();
  if (!phone || !/^\+?\d{10,15}$/.test(phone)) {
    return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
  }
  await dbConnect();

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await Otp.create({ phone, code, expiresAt });

  // Try Twilio if configured
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (sid && token && from) {
    try {
      const twilio = (await import("twilio")).default(sid, token);
      await twilio.messages.create({
        body: `Your Sanjay Communications OTP is ${code}. Valid for 5 minutes.`,
        from,
        to: phone.startsWith("+") ? phone : `+91${phone}`,
      });
    } catch (e) {
      console.error("Twilio send failed:", e);
    }
  } else {
    // Dev fallback — log to server console
    console.log(`[OTP] ${phone} → ${code}`);
  }

  return NextResponse.json({
    ok: true,
    devCode: process.env.NODE_ENV === "production" ? undefined : code,
  });
}
