export interface CreateVendorInput {
  name: string;
  ownerName: string;
  foodType: [string];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
}

export interface EditVendorInput {
  name: string;
  address: string;
  phone: string;
  foodType: [string];
}

export interface VendorLoginInput {
  email: string;
  password: string;
}

export interface VendorPayload {
  _id: string;
  email: string;
  name: string;
  foodType: [string];
}

export interface CreateDiscountInput {
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
