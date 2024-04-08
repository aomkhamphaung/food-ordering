import express from "express";
import {
  changeServiceStatus,
  deliveryLogin,
  deliverySignup,
  getDeliveryProfile,
  updateDeliveryProfile,
} from "../controllers";
import { Authenticate } from "../middlewares";

const router = express.Router();

/**-------------------- Signup -------------------- */
router.post("/signup", deliverySignup);

/**-------------------- Login -------------------- */
router.post("/login", deliveryLogin);

// Middleware
router.use(Authenticate);

/**-------------------- Change Service Status -------------------- */
router.put("/change-status", changeServiceStatus);

/**-------------------- Profile -------------------- */
router.get("/profile", getDeliveryProfile);
router.patch("/profile", updateDeliveryProfile);

export { router as DeliveryRoute };
