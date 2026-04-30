import mongoose, { Schema, models, model } from "mongoose";

const BannerSchema = new Schema(
  {
    title: String,
    subtitle: String,
    image: String,
    ctaText: { type: String, default: "Shop now" },
    ctaLink: { type: String, default: "/products" },
    isActive: { type: Boolean, default: true },
    position: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Banner = models.Banner || model("Banner", BannerSchema);

const OtpSchema = new Schema(
  {
    phone: { type: String, required: true, index: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    consumed: { type: Boolean, default: false },
  },
  { timestamps: true }
);
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const Otp = models.Otp || model("Otp", OtpSchema);
