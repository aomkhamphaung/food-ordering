import express, { Request, Response, NextFunction } from "express";
import multer from "multer";

import {
  vendorLogin,
  createFood,
  getVendorProfile,
  updateVendorProfile,
  updateVendorService,
  getFoods,
  updateVendorCoverImage,
  getOrders,
  processOrder,
  getOrderDetails,
} from "../controllers";
import { Authenticate } from "../middlewares";

const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/images");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const upload = multer({ storage: imageStorage }).array("images", 10);

router.post("/login", vendorLogin);

router.use(Authenticate);

router.get("/profile", getVendorProfile);
router.patch("/profile", updateVendorProfile);

router.patch("/coverimage", upload, updateVendorCoverImage);

router.patch("/service", updateVendorService);

router.post("/food", upload, createFood);
router.get("/foods", getFoods);

/**-------------------- Order -------------------- */
router.get("/orders", getOrders);
router.put("/order/:id/process", processOrder);
router.get("/order/:id", getOrderDetails);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send({ message: "Vendor Route" });
});

export { router as VendorRoute };
