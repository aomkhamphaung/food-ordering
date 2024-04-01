import { Request, Response, NextFunction } from "express";
import { CreateVandorInput } from "../dto";
import { Vandor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";

export const FindVandor = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Vandor.findOne({ email: email });
  } else {
    return await Vandor.findById(id);
  }
};

export const CreateVandor = async (
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
  } = <CreateVandorInput>req.body;

  const existingVandor = await FindVandor("", email);

  if (existingVandor !== null) {
    return res
      .status(409)
      .json({ message: "Vandor already exists with this email!" });
  }

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const createdVandor = await Vandor.create({
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

  return res.status(200).json(createdVandor);
};

export const GetVandors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vandors = await Vandor.find();

  if (vandors !== null) {
    return res.status(200).json(vandors);
  }

  return res.status(404).json({ message: "No vandor data found!" });
};

export const GetVandorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vandorId = req.params.id;
  const vandor = await FindVandor(vandorId);

  if (vandor !== null) {
    return res.status(200).json(vandor);
  }

  return res.status(404).json({ message: "No vandor data found!" });
};
