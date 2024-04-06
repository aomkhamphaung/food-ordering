import mongoose, { Document, Schema } from "mongoose";

export interface DiscountDoc extends Document {
  discountType: string;
  vendors: [any];
  title: string;
  description: string;
  minVal: number;
  discountAmount: number;
  startDate: Date;
  endDate: Date;
  promoCode: string;
  promoType: string;
  bank: [any];
  bins: [any];
  pincode: string;
  isActive: boolean;
}

const DiscountSchema = new Schema(
  {
    discountType: { type: String, require: true },
    vendors: [
      {
        type: Schema.Types.ObjectId,
        ref: "vendor",
      },
    ],
    title: { type: String, require: true },
    description: { type: String, require: true },
    minVal: { type: Number, require: true },
    discountAmount: { type: Number, require: true },
    startDate: { type: Date, require: true },
    endDate: { type: Date, require: true },
    promoCode: { type: String, require: true },
    promoType: { type: String, require: true },
    bank: [{ type: String }],
    bins: [{ type: Number }],
    pincode: { type: String, require: true },
    isActive: { type: Boolean },
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

const Discount = mongoose.model<DiscountDoc>("discount", DiscountSchema);
export { Discount };
