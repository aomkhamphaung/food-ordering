import express from "express";
import {
  addToCart,
  createOrder,
  createPayment,
  customerLogin,
  customerSignup,
  customerVerify,
  deleteCartItems,
  getCartItems,
  getCustomerProfile,
  getOrderById,
  getOrdersByCustomer,
  requestOtp,
  updateCustomerProfile,
  verifyDiscount,
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

/**-------------------- Cart -------------------- */
router.post("/cart", addToCart);
router.get("/cart", getCartItems);
router.delete("/cart", deleteCartItems);

/**-------------------- Apply Discount -------------------- */
router.get("/discount/verify/:id", verifyDiscount);

/**-------------------- Payment -------------------- */
router.post("/create-payment", createPayment);

/**-------------------- Order -------------------- */
router.post("/create-orders", createOrder);
router.get("/orders", getOrdersByCustomer);
router.get("/order/:id", getOrderById);

export { router as CustomerRoute };
