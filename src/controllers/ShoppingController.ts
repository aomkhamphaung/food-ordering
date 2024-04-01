import express, { Request, Response, NextFunction } from "express";

/**-------------------- Food Availability -------------------- */
export const GetFoodAvaility = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

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
