import express, { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import { CreateCustomerInput } from "../dto";
import { validate } from "class-validator";
import { GenerateOtp, GeneratePassword, GenerateSalt } from "../utility";
import { Customer } from "../models/Customer";

/**-------------------- Signup -------------------- */
export const customerSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const CustomerInputs = plainToClass(CreateCustomerInput, req.body);

  const inputErrors = await validate(CustomerInputs, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { email, phone, password } = CustomerInputs;

  const salt = await GenerateSalt();
  const customerPassword = await GeneratePassword(password, salt);

  const { otp, expiry } = await GenerateOtp();

  const result = await Customer.create({
    email: email,
    password: customerPassword,
    salt: salt,
    phone: phone,
    otp: otp,
    otp_expiry: expiry,
    firstName: "",
    lastName: "",
    address: "",
    verified: false,
    lat: 0,
    lng: 0,
  });

  if (result) {
  }
};

/**-------------------- Login -------------------- */
export const customerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

/**-------------------- Verify -------------------- */
export const customerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

/**-------------------- Request OTP -------------------- */
export const requestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

/**-------------------- Get Customer Profile -------------------- */
export const getCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

/**-------------------- Update Customer Profile -------------------- */
export const updateCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
