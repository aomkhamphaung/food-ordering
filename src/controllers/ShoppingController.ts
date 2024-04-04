import express, { Request, Response, NextFunction } from "express";
import { Vendor, FoodDoc } from "../models";

/**-------------------- Food Availability -------------------- */
export const GetFoodAvaility = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: true,
  })
    .sort([["rating", "descending"]])
    .populate("foods");

  if (result.length > 0) {
    return res.status(200).json(result);
  }

  return res.status(404).json({ message: "No Data Found!" });
};

/**-------------------- Top Restaurants -------------------- */
export const getTopRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: true,
  })
    .sort([["rating", "descending"]])
    .limit(10);

  if (result.length > 0) {
    return res.status(200).json(result);
  }

  return res.status(404).json("No Data Found!");
};

/**-------------------- Food Available in 30 mins -------------------- */
export const getFoodsIn30Mins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: true,
  }).populate("foods");

  if (result.length > 0) {
    let foodResult: any = [];

    result.map((vendor) => {
      const foods = vendor.foods as [FoodDoc];

      foodResult.push(...foods.filter((food) => food.readyTime <= 30));
    });

    return res.status(200).json(foodResult);
  }

  return res.status(404).json({ message: "No Data Found!" });
};

/**-------------------- Search Food -------------------- */
export const getSearchFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: true,
  }).populate("foods");

  if (result.length > 0) {
    let foodResult: any = [];
    result.map((item) => foodResult.push(...item.foods));

    return res.status(200).json(foodResult);
  }

  return res.status(404).json({ message: "No Data Found!" });
};

/**-------------------- Find Restaurant By Id -------------------- */
export const getRestaurantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const result = await Vendor.findById(id).populate("foods");

  if (result) {
    res.status(200).json(result);
  }

  res.status(404).json({ message: "No Data Found!" });
};
