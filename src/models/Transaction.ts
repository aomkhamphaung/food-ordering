import mongoose, { Document, Schema } from "mongoose";

interface TransactionDoc extends Document {
  customer: string;
  vendorId: string;
  orderId: string;
  orderValue: number;
  discountUsed: string;
  status: string;
  paymentMethod: string;
  paymentResponse: string;
}

const TransactionSchema = new Schema(
  {
    customer: { type: String },
    vendorId: { type: String },
    orderId: { type: String },
    orderValue: { type: Number },
    discountUsed: { type: String },
    status: { type: String },
    paymentMethod: { type: String },
    paymentResponse: { type: String },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

const Transaction = mongoose.model<TransactionDoc>(
  "transaction",
  TransactionSchema
);
export { Transaction };
