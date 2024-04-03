import mongoose, { Document, Model, Schema } from "mongoose";

export interface OrderDoc extends Document {
  orderId: string;
  items: [any];
  totalAmount: number;
  orderDate: Date;
  paymentMethod: string;
  paymentResponse: string;
  orderStatus: string;
}

const OrderSchema = new Schema(
  {
    orderId: { type: String },
    items: [
      {
        food: { type: Schema.Types.ObjectId, ref: "food", required: true },
        unit: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date },
    paymentMethod: { type: String },
    paymentResponse: { type: String },
    orderStatus: { type: String },
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
