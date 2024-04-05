import mongoose, { Document, Model, Schema } from "mongoose";

export interface OrderDoc extends Document {
  orderId: string;
  vendorId: string;
  items: [any];
  totalAmount: number;
  orderDate: Date;
  paymentMethod: string;
  paymentResponse: string;
  orderStatus: string;
  remarks: string;
  deliveryId: string;
  appliedDiscounts: boolean;
  discountId: string;
  readyTime: number;
}

const OrderSchema = new Schema(
  {
    orderId: { type: String },
    vendorId: { type: String, require: true },
    items: [
      {
        food: { type: Schema.Types.ObjectId, ref: "food", require: true },
        unit: { type: Number, require: true },
      },
    ],
    totalAmount: { type: Number, require: true },
    orderDate: { type: Date },
    paymentMethod: { type: String },
    paymentResponse: { type: String },
    orderStatus: { type: String },
    remarks: { type: String },
    deliveryId: { type: String },
    appliedDiscount: { type: Boolean },
    discountId: { type: String },
    readyTime: { type: Number },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Order = mongoose.model<OrderDoc>("order", OrderSchema);
export { Order };
