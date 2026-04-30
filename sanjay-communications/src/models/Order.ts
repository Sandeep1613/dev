import mongoose, { Schema, models, model } from "mongoose";

const OrderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    image: String,
    price: Number,
    quantity: { type: Number, default: 1 },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [OrderItemSchema], default: [] },
    subtotal: Number,
    shippingFee: { type: Number, default: 0 },
    total: Number,
    address: {
      name: String,
      phone: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: "India" },
    },
    paymentMethod: { type: String, enum: ["razorpay", "cod"], required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    orderStatus: {
      type: String,
      enum: ["placed", "confirmed", "shipped", "delivered", "cancelled"],
      default: "placed",
    },
  },
  { timestamps: true }
);

export const Order = models.Order || model("Order", OrderSchema);
