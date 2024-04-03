import express, { Request, Response, NextFunction } from "express";
import {
  createOrder,
  customerLogin,
  customerSignup,
  customerVerify,
  getCustomerProfile,
  getOrderById,
  getOrders,
  requestOtp,
  updateCustomerProfile,
} from "../controllers/CustomerController";
import { Authenticate } from "../middlewares";

const router = express.Router();

/**-------------------- Signup -------------------- */
router.post("/signup", customerSignup);

/**-------------------- Login -------------------- */
router.post("/login", customerLogin);

// Middleware
router.use(Authenticate);

/**-------------------- Verify Account -------------------- */
router.post("/verify", customerVerify);

/**-------------------- Request OTP -------------------- */
router.get("/otp", requestOtp);

/**-------------------- Profile -------------------- */
router.get("/profile", getCustomerProfile);
router.patch("/profile", updateCustomerProfile);

/**-------------------- Order -------------------- */
router.post("/create-orders", createOrder);
router.get("/orders", getOrders);
router.get("/order:id", getOrderById);

export { router as CustomerRoute };
