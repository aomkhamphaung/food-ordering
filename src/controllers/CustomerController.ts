import express, { Request, Response, NextFunction } from "express";

/**-------------------- Signup -------------------- */
export const customerSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

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
