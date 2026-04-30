import mongoose, { Schema, models, model } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    brand: { type: String, default: "" },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0, min: 0 },
    images: { type: [String], default: [] },
    description: { type: String, default: "" },
    specifications: { type: Map, of: String, default: {} },
    stock: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Product = models.Product || model("Product", ProductSchema);
