import express, { Request, Response, NextFunction } from "express";
import {
  customerLogin,
  customerSignup,
  customerVerify,
  getCustomerProfile,
  requestOtp,
  updateCustomerProfile,
} from "../controllers/CustomerController";

const router = express.Router();

/**-------------------- Signup -------------------- */
router.post("/signup", customerSignup);

/**-------------------- Login -------------------- */
router.post("/login", customerLogin);

/**-------------------- Verify Account -------------------- */
router.post("/verify", customerVerify);

/**-------------------- Request OTP -------------------- */
router.get("/otp", requestOtp);

/**-------------------- Profile -------------------- */
router.get("/profile", getCustomerProfile);
router.patch("profile", updateCustomerProfile);

export { router as CustomerRoute };
