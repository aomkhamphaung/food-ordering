import express, { Request, Response, NextFunction } from "express";
import { Vandor } from "../models";

/**-------------------- Food Availability -------------------- */
export const GetFoodAvaility = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vandor.find({
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
) => {};

/**-------------------- Food Available in 30 mins -------------------- */
export const getFoodsIn30Mins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

/**-------------------- Search Food -------------------- */
export const getSearchFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

/**-------------------- Find Restaurant By Id -------------------- */
export const getRestaurantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
