import { Request, Response, NextFunction } from "express";
import { CreateFoodInput, EditVandorInput, VandorLoginInput } from "../dto";
import { FindVandor } from "./AdminController";
import { GenerateToken, ValidatePassword } from "../utility";
import { Food } from "../models";

export const vandorLogin = async (
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
) => {
  const user = req.user;

  if (user) {
    const existingVandor = await FindVandor(user._id);

    if (existingVandor !== null) {
      existingVandor.serviceAvailable = !existingVandor.serviceAvailable;
      const savedResult = await existingVandor.save();
      return res.status(200).json(savedResult);
    }

    return res.status(200).json(existingVandor);
  }
};

export const createFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const { name, description, category, foodType, readyTime, price } = <
      CreateFoodInput
    >req.body;

    const vandor = await FindVandor(user._id);

    if (vandor !== null) {
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);

      const createdFood = await Food.create({
        vandorId: vandor._id,
        name: name,
        description: description,
        category: category,
        foodType: foodType,
        images: images,
        readyTime: readyTime,
        price: price,
        rating: 0,
      });

      vandor.foods.push(createdFood);
      const result = await vandor.save();

      return res.status(200).json(result);
    }
  }

  return res.status(500).json({ message: "Something went wrong!" });
};

export const getFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const foods = await Food.find({ vandorId: user._id });

    if (foods !== null) {
      return res.status(200).json(foods);
    }
  }

  return res.status(404).json({ message: "Food information not found!" });
};
