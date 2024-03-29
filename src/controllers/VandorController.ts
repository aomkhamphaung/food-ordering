import { Request, Response, NextFunction } from "express";
import { EditVandorInput, VandorLoginInput } from "../dto";
import { FindVandor } from "./AdminController";
import { GenerateToken, ValidatePassword } from "../utility";

export const VandorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VandorLoginInput>req.body;
  const existingVandor = await FindVandor("", email);

  if (existingVandor !== null) {
    const validation = await ValidatePassword(
      password,
      existingVandor.password,
      existingVandor.salt
    );

    if (validation) {
      const signature = GenerateToken({
        _id: existingVandor.id,
        email: existingVandor.email,
        name: existingVandor.name,
        foodType: existingVandor.foodType,
      });

      return res.status(200).json(signature);
    } else {
      return res.status(401).json({ message: "Wrong password!" });
    }
  }

  return res.status(401).json({ message: "Invalid login credentials!" });
};

export const getVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existingVandor = await FindVandor(user._id);
    return res.status(200).json(existingVandor);
  }

  return res.status(404).json({ message: "Vendor information not found!" });
};

export const updateVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { foodType, name, address, phone } = <EditVandorInput>req.body;

  const user = req.user;

  if (user) {
    const existingVandor = await FindVandor(user._id);

    if (existingVandor !== null) {
      existingVandor.name = name;
      existingVandor.phone = phone;
      existingVandor.address = address;
      existingVandor.foodType = foodType;

      const savedResult = await existingVandor.save();
      return res.status(200).json(savedResult);
    }

    return res.status(200).json(existingVandor);
  }

  return res.status(404).json({ message: "Vandor information not found!" });
};

export const updateVandorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
