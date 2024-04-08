import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Transaction, Vendor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";
import { Delivery } from "../models/Delivery";

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
    lat: 0,
    lng: 0,
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

/**-------------------- Verify Deliveryman -------------------- */
export const verifyDelivery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { _id, status } = req.body;

  if (_id) {
    const profile = await Delivery.findById(_id);

    if (profile) {
      profile.verified = status;
      const result = await profile.save();

      return res.status(200).json(result);
    }
  }

  return res.status(400).json({ message: "Unable to verify delivery man!" });
};

/**-------------------- Get All Delivery Men -------------------- */
export const getAllDeliveryMen = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliverymen = await Delivery.find();

  if (deliverymen) {
    return res.status(200).json(deliverymen);
  }

  return res.status(400).json({ message: "Error fetching delivery men!" });
};
