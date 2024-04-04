import { Request, Response, NextFunction } from "express";
import { CreateFoodInput, EditVendorInput, VendorLoginInput } from "../dto";
import { FindVendor } from "./AdminController";
import { GenerateToken, ValidatePassword } from "../utility";
import { Food, Vendor } from "../models";

/**-------------------- Vendor Login -------------------- */
export const vendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VendorLoginInput>req.body;
  const existingVendor = await FindVendor("", email);

  if (existingVendor !== null) {
    const validation = await ValidatePassword(
      password,
      existingVendor.password,
      existingVendor.salt
    );

    if (validation) {
      const token = GenerateToken({
        _id: existingVendor.id,
        email: existingVendor.email,
        name: existingVendor.name,
        foodType: existingVendor.foodType,
      });

      return res.status(200).json(token);
    } else {
      return res.status(401).json({ message: "Wrong password!" });
    }
  }

  return res.status(401).json({ message: "Invalid login credentials!" });
};

/**-------------------- Get Vendor Profile -------------------- */
export const getVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existingVendor = await FindVendor(user._id);
    return res.status(200).json(existingVendor);
  }

  return res.status(404).json({ message: "Vendor information not found!" });
};

/**-------------------- Update Vendor Profile -------------------- */
export const updateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { foodType, name, address, phone } = <EditVendorInput>req.body;

  const user = req.user;

  if (user) {
    const existingVendor = await FindVendor(user._id);

    if (existingVendor !== null) {
      existingVendor.name = name;
      existingVendor.phone = phone;
      existingVendor.address = address;
      existingVendor.foodType = foodType;

      const savedResult = await existingVendor.save();
      return res.status(200).json(savedResult);
    }

    return res.status(200).json(existingVendor);
  }

  return res.status(404).json({ message: "Vendor information not found!" });
};

/**-------------------- Update Vendor Service -------------------- */
export const updateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existingVendor = await FindVendor(user._id);

    if (existingVendor !== null) {
      existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
      const savedResult = await existingVendor.save();
      return res.status(200).json(savedResult);
    }

    return res.status(200).json(existingVendor);
  }
};

/**-------------------- Update Vendor Cover Image -------------------- */
export const updateVendorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const vendor = await FindVendor(user._id);

    if (vendor !== null) {
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);
      vendor.coverImages.push(...images);

      const result = await vendor.save();

      return res.status(200).json(result);
    }
  }
  return res.status(500).json({ message: "Something went wrong!" });
};

/**-------------------- Create Food -------------------- */
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

    const vendor = await FindVendor(user._id);

    if (vendor !== null) {
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);

      const createdFood = await Food.create({
        vendorId: vendor._id,
        name: name,
        description: description,
        category: category,
        foodType: foodType,
        images: images,
        readyTime: readyTime,
        price: price,
        rating: 0,
      });

      vendor.foods.push(createdFood);
      const result = await vendor.save();
      console.log(result);
      return res.status(200).json(result);
    }
  }

  return res.status(500).json({ message: "Something went wrong!" });
};

/**-------------------- Get All Foods -------------------- */
export const getFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const foods = await Food.find({ vendorId: user._id });

    if (foods !== null) {
      return res.status(200).json(foods);
    }
  }

  return res.status(404).json({ message: "Food information not found!" });
};

/**-------------------- Get Orders -------------------- */
export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

/**-------------------- Process Order -------------------- */
export const processOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

/**-------------------- Get Order Details -------------------- */
export const getOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
