import { IsEmail, Length } from "class-validator";

export class CreateDeliveryInput {
  @IsEmail()
  email: string;

  @Length(7, 12)
  phone: string;

  @Length(6, 12)
  password: string;

  @Length(3, 12)
  firstName: string;

  @Length(3, 12)
  lastName: string;

  @Length(6, 24)
  address: string;

  @Length(4, 12)
  pincode: string;
}

export class DeliveryLoginInput {
  @IsEmail()
  email: string;

  @Length(6, 12)
  password: string;
}

export class EditDeliveryInput {
  @Length(3, 12)
  firstName: string;

  @Length(3, 12)
  lastName: string;

  @Length(6, 24)
  address: string;
}
