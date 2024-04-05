import mongoose, { Document, Schema } from "mongoose";
import { OrderDoc } from "./Order";

interface CustomerDoc extends Document {
  email: string;
  password: string;
  salt: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  verified: boolean;
  otp: number;
  otp_expiry: Date;
  lat: number;
  lng: number;
  cart: [any];
  orders: [OrderDoc];
}

const CustomerSchema = new Schema(
  {
    email: { type: String, require: true },
    password: { type: String, require: true },
    salt: { type: String, require: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    phone: { type: Number, require: true },
    verified: { type: Boolean, require: true },
    otp: { type: Number, require: true },
    otp_expiry: { type: Date, require: true },
    lat: { type: Number },
    lng: { type: Number },
    cart: [
      {
        food: { type: Schema.Types.ObjectId, ref: "food", require: true },
        unit: { type: Number, require: true },
      },
    ],
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "order",
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Customer = mongoose.model<CustomerDoc>("customers", CustomerSchema);

export { Customer };
