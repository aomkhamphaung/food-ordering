import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Transaction, Vendor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";

export const FindVendor = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Vendor.findOne({ email: email });
  } else {
    return await Vendor.findById(id);
  }
};

/**-------------------- Create Vendor -------------------- */
export const createVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    foodType,
    pincode,
    address,
    phone,
    ownerName,
    email,
    password,
  } = <CreateVendorInput>req.body;

  const existingVendor = await FindVendor("", email);

  if (existingVendor !== null) {
    return res
      .status(409)
      .json({ message: "Vendor already exists with this email!" });
  }

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const createdVendor = await Vendor.create({
    name: name,
    address: address,
    pincode: pincode,
    foodType: foodType,
    email: email,
    password: userPassword,
    salt: salt,
    ownerName: ownerName,
    phone: phone,
    rating: 0,
    serviceAvailable: false,
    coverImages: [],
    foods: [],
  });

  return res.status(200).json(createdVendor);
};

/**-------------------- Get All Vendors -------------------- */
export const getVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendors = await Vendor.find();

  if (vendors !== null) {
    return res.status(200).json(vendors);
  }

  return res.status(404).json({ message: "No vendor data found!" });
};

/**-------------------- Get Vendor by Id -------------------- */
export const getVendorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendorId = req.params.id;
  const vendor = await FindVendor(vendorId);

  if (vendor !== null) {
    return res.status(200).json(vendor);
  }

  return res.status(404).json({ message: "No vendor data found!" });
};

/**-------------------- Get All Transaction -------------------- */
export const getTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const transactions = await Transaction.find();

  if (transactions) {
    return res.status(200).json(transactions);
  }

  return res.status(404).json({ message: "No Transaction data available!" });
};

/**-------------------- Get Transaction By Id -------------------- */
export const getTransactionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const transaction_id = req.params.id;
  const transaction = await Transaction.findById(transaction_id);

  if (transaction) {
    return res.status(200).json(transaction);
  }

  return res.status(404).json({ message: "No Transaction data found!" });
};
