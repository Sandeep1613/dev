import mongoose, { Schema, models, model } from "mongoose";

const AddressSchema = new Schema(
  {
    name: String,
    phone: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: "India" },
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    phone: { type: String, unique: true, sparse: true, trim: true },
    passwordHash: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    addresses: { type: [AddressSchema], default: [] },
  },
  { timestamps: true }
);

export type IUser = mongoose.InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId };
export const User = models.User || model("User", UserSchema);
