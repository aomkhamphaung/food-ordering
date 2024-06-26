import { IsEmail, Length } from "class-validator";

export class CreateCustomerInput {
  @IsEmail()
  email: string;

  @Length(7, 12)
  phone: string;

  @Length(6, 12)
  password: string;
}

export class CustomerLoginInput {
  @IsEmail()
  email: string;

  @Length(6, 12)
  password: string;
}

export class EditCustomerInput {
  @Length(3, 16)
  firstName: string;

  @Length(3, 16)
  lastName: string;

  @Length(6, 24)
  address: string;
}

export interface CustomerPayload {
  _id: string;
  email: string;
  verified: boolean;
}

export class CartItem {
  _id: string;
  unit: number;
}

export class OrderInput {
  transaction_id: string;
  amount: string;
  items: [CartItem];
}
