import { Request, Response, NextFunction } from "express";
import { VandorLoginInput } from "../dto";
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
) => {};

export const updateVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const updateVandorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
