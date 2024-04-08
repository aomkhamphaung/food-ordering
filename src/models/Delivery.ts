import mongoose, { Document, Schema } from "mongoose";

interface DeliveryDoc extends Document {
  email: string;
  password: string;
  salt: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  verified: boolean;
  lat: number;
  lng: number;
  isAvailable: boolean;
}

const DeliverySchema = new Schema(
  {
    email: { type: String, require: true },
    password: { type: String, require: true },
    salt: { type: String, require: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    phone: { type: Number, require: true },
    verified: { type: Boolean, require: true },
    lat: { type: Number },
    lng: { type: Number },
    isAvailable: { type: Boolean },
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

const Delivery = mongoose.model<DeliveryDoc>("delivery", DeliverySchema);

export { Delivery };
