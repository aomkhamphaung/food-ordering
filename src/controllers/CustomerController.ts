import express, { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import {
  CreateCustomerInput,
  CustomerLoginInput,
  EditCustomerInput,
  OrderInput,
} from "../dto";
import { validate } from "class-validator";
import {
  GenerateOtp,
  GeneratePassword,
  GenerateSalt,
  GenerateToken,
  RequestOtp,
  ValidatePassword,
} from "../utility";
import { Food, Customer, Order } from "../models";
import mongoose from "mongoose";

/**-------------------- Signup -------------------- */
export const customerSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const CustomerInputs = plainToClass(CreateCustomerInput, req.body);

  const inputErrors = await validate(CustomerInputs, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { email, phone, password } = CustomerInputs;

  const salt = await GenerateSalt();
  const customerPassword = await GeneratePassword(password, salt);

  const { otp, expiry } = await GenerateOtp();

  const existingUser = await Customer.findOne({ email: email });

  if (existingUser !== null) {
    return res
      .status(409)
      .json({ message: "This email is associated with the user" });
  }
  const result = await Customer.create({
    email: email,
    password: customerPassword,
    salt: salt,
    phone: phone,
    otp: otp,
    otp_expiry: expiry,
    firstName: "",
    lastName: "",
    address: "",
    verified: false,
    lat: 0,
    lng: 0,
    orders: [],
  });

  if (result) {
    await RequestOtp(otp, phone);

    const token = GenerateToken({
      _id: result._id,
      email: result.email,
      verified: result.verified,
    });

    res
      .status(201)
      .json({ token: token, verified: result.verified, email: result.email });
  }
};

/**-------------------- Login -------------------- */
export const customerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginInput = plainToClass(CustomerLoginInput, req.body);

  const loginErrors = await validate(loginInput, {
    validationError: { target: false },
  });

  if (loginErrors.length > 0) {
    return res.status(400).json(loginErrors);
  }

  const { email, password } = loginInput;
  const customer = await Customer.findOne({ email: email, verified: true });

  if (customer) {
    const validation = await ValidatePassword(
      password,
      customer.password,
      customer.salt
    );

    if (validation) {
      const token = GenerateToken({
        _id: customer._id,
        email: customer.email,
        verified: customer.verified,
      });

      return res.status(200).json({
        token: token,
        email: customer.email,
        verified: customer.verified,
      });
    }
    return res.status(401).json({ message: "Invalid login credentials!" });
  }
  return res.status(404).json({ message: "Invalid user!" });
};

/**-------------------- Verify -------------------- */
export const customerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = req.body;
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
        profile.verified = true;

        const verifiedCustomer = await profile.save();

        const token = GenerateToken({
          _id: verifiedCustomer._id,
          email: verifiedCustomer.email,
          verified: verifiedCustomer.verified,
        });

        return res.status(200).json({
          token: token,
          email: verifiedCustomer.email,
          verified: verifiedCustomer.verified,
        });
      }
      return res.status(400).json({ message: "Invalid otp entered!" });
    }
  }
};

/**-------------------- Request OTP -------------------- */
export const requestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      const { otp, expiry } = await GenerateOtp();

      profile.otp = otp;
      profile.otp_expiry = expiry;

      await profile.save();
      await RequestOtp(otp, profile.phone);

      return res
        .status(200)
        .json({ message: "Otp sent to your requested phone" });
    }
  }
  return res.status(500).json({ message: "Error sending otp to your phone!" });
};

/**-------------------- Get Customer Profile -------------------- */
export const getCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      return res.status(200).json(profile);
    }
  }

  return res
    .status(500)
    .json({ message: "Something went wrong while fetching profile data!" });
};

/**-------------------- Update Customer Profile -------------------- */
export const updateCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  const profileInput = plainToClass(EditCustomerInput, req.body);
  const profileErrors = await validate(profileInput, {
    validationError: { target: false },
  });

  if (profileErrors.length > 0) {
    return res.status(400).json(profileErrors);
  }

  const { firstName, lastName, address } = profileInput;

  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;

      const updatedProfile = await profile.save();
      return res.status(200).json(updatedProfile);
    }
  }

  return res.status(500).json({ message: "Error updating profile!" });
};

/**-------------------- Create Order -------------------- */
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const orderId = `${Math.floor(Math.random() * 99999) + 1000}`;

    const profile = await Customer.findById(customer._id);
    const cart = <[OrderInput]>req.body;

    let cartItems = Array();
    let netAmount = 0.0;

    const foods = await Food.find()
      .where("_id")
      .in(cart.map((item) => item._id))
      .exec();

    foods.map((food) => {
      cart.map(({ _id, unit }) => {
        const itemId = new mongoose.Types.ObjectId(_id);
        if (food._id.equals(itemId)) {
          netAmount += food.price * unit;
          cartItems.push({ food, unit });
        }
      });
    });

    if (cartItems) {
      const currentOrder = await Order.create({
        orderId: orderId,
        items: cartItems,
        totalAmount: netAmount,
        orderDate: new Date(),
        paymentMethod: "Visa Card",
        paymentResponse: "",
        orderStatus: "Pending",
      });

      if (currentOrder) {
        profile?.orders.push(currentOrder);
        await profile?.save();

        return res.status(201).json(currentOrder);
      }
    }

    return res.status(400).json({ message: "Error creating order!" });
  }
};

/**-------------------- Get Orders -------------------- */
export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id).populate("orders");

    if (profile) {
      return res.status(200).json(profile);
    }

    return res.status(404).json("No Order Found!");
  }
};

/**-------------------- Get Order By Id -------------------- */
export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;

  if (orderId) {
    const order = await Order.findById(orderId).populate("items.food");

    return res.status(200).json(order);
  }

  return res.status(404).json({ message: "No order found!" });
};
