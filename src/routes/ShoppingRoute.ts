import express, { Request, Response, NextFunction } from "express";
import {
  GetFoodAvaility,
  getFoodsIn30Mins,
  getSearchFoods,
  getTopRestaurants,
  getRestaurantById,
} from "../controllers";

const router = express.Router();

/**-------------------- Food Availability -------------------- */
router.get("/:pincode", GetFoodAvaility);

/**-------------------- Top Restaurants -------------------- */
router.get("/top-restaurants/:pincode", getTopRestaurants);

/**-------------------- Food Available in 30 mins -------------------- */
router.get("/foods-in-30mins/:pincode", getFoodsIn30Mins);

/**-------------------- Search Food -------------------- */
router.get("/search/:pincode", getSearchFoods);

/**-------------------- Find Restaurant By Id -------------------- */
router.get("restaurant/:id", getRestaurantById);

export { router as ShoppingRoute };
