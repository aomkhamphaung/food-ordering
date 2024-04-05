import express, { Request, Response, NextFunction } from "express";
import { createVendor, getVendorById, getVendors } from "../controllers";

const router = express.Router();

router.post("/vendor", createVendor);

router.get("/vendors", getVendors);

router.get("/vendor/:id", getVendorById);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Admin Route" });
});

export { router as AdminRoute };
