import { Request, Response, NextFunction } from "express";
import {
  CreateDiscountInput,
  CreateFoodInput,
  EditVendorInput,
  VendorLoginInput,
} from "../dto";
import { FindVendor } from "./AdminController";
import { GenerateToken, ValidatePassword } from "../utility";
import { Food, Order, Vendor } from "../models";
import { Discount } from "../models/Discount";

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
) => {
  const user = req.user;

  if (user) {
    const orders = await Order.find({ vendorId: user._id }).populate(
      "items.food"
    );

    if (orders !== null) {
      return res.status(200).json(orders);
    }
  }

  return res.status(404).json({ message: "No order found!" });
};

/**-------------------- Process Order -------------------- */
export const processOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;

  const { status, remarks, time } = req.body;

  if (orderId) {
    const order = await Order.findById(orderId).populate("items.food");

    if (order != null) {
      order.orderStatus = status;
      order.remarks = remarks;
      if (time) {
        order.readyTime = time;
      }

      const result = await order.save();
      return res.status(200).json(result);
    }
  }

  return res.status(400).json({ message: "Unable to process order!" });
};

/**-------------------- Get Order Details -------------------- */
export const getOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;

  if (orderId) {
    const order = await Order.findById(orderId).populate("items.food");

    if (order !== null) {
      return res.status(200).json(order);
    }
  }

  return res.status(404).json({ message: "No order found!" });
};

/**-------------------- Get Discounts -------------------- */
export const getDiscounts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const discounts = await Discount.find().populate("vendors");

    let currentDiscounts = Array();

    if (discounts) {
      discounts.map((discount) => {
        if (discount.vendors) {
          discount.vendors.map((vendor) => {
            if (vendor._id.toString() === user._id) {
              currentDiscounts.push(discount);
            }
          });
        }

        if (discount.discountType === "GENERIC") {
          currentDiscounts.push(discount);
        }
      });
    }
    return res.status(200).json(currentDiscounts);
  }
  return res.status(400).json("No discount data available!");
};

/**-------------------- Add Discount -------------------- */
export const addDiscount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const {
      title,
      description,
      minVal,
      discountAmount,
      pincode,
      promoCode,
      promoType,
      startDate,
      endDate,
      bank,
      bins,
      isActive,
    } = <CreateDiscountInput>req.body;

    const vendor = await FindVendor(user._id);
    if (vendor) {
      const discount = await Discount.create({
        title,
        description,
        minVal,
        discountAmount,
        pincode,
        promoCode,
        promoType,
        startDate,
        endDate,
        bank,
        bins,
        isActive,
        vendors: [vendor],
      });

      return res.status(200).json(discount);
    }
  }
  return res.status(400).json({ message: "Unable to add discount!" });
};

/**-------------------- Update Discount -------------------- */
export const updateDiscount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const discountId = req.params.id;

  if (user) {
    const {
      title,
      description,
      minVal,
      discountAmount,
      pincode,
      promoCode,
      promoType,
      startDate,
      endDate,
      bank,
      bins,
      isActive,
    } = <CreateDiscountInput>req.body;

    const discount = await Discount.findById(discountId);

    if (discount) {
      const vendor = await FindVendor(user._id);
      if (vendor) {
        (discount.title = title),
          (discount.description = description),
          (discount.minVal = minVal),
          (discount.discountAmount = discountAmount),
          (discount.pincode = pincode),
          (discount.promoCode = promoCode),
          (discount.promoType = promoType),
          (discount.startDate = startDate),
          (discount.endDate = endDate),
          (discount.bank = bank),
          (discount.bins = bins),
          (discount.isActive = isActive);

        const updatedDiscount = await discount.save();

        return res.status(200).json(updatedDiscount);
      }
    }
  }
  return res.status(400).json({ message: "Unable to add discount!" });
};
