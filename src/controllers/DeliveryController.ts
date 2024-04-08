import { Request, Response, NextFunction } from "express";
import {
  CreateDeliveryInput,
  DeliveryLoginInput,
  EditDeliveryInput,
} from "../dto/Delivery.dto";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import {
  GeneratePassword,
  GenerateSalt,
  GenerateToken,
  ValidatePassword,
} from "../utility";
import { Delivery } from "../models/Delivery";

/**-------------------- Delivery Signup -------------------- */
export const deliverySignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryInput = plainToClass(CreateDeliveryInput, req.body);

  const inputErrors = await validate(deliveryInput, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { email, phone, password, firstName, lastName, address, pincode } =
    deliveryInput;

  const salt = await GenerateSalt();
  const deliveryPassword = await GeneratePassword(password, salt);

  const existingDeliveryman = await Delivery.findOne({ email: email });

  if (existingDeliveryman !== null) {
    return res.status(409).json({ message: "Email is already in use." });
  }

  const delivery = await Delivery.create({
    email: email,
    phone: phone,
    salt: salt,
    password: deliveryPassword,
    firstName: firstName,
    lastName: lastName,
    address: address,
    pincode: pincode,
    verified: false,
    lat: 0,
    lng: 0,
    isAvailable: false,
  });

  if (delivery) {
    const token = await GenerateToken({
      _id: delivery._id,
      email: delivery.email,
      verified: delivery.verified,
    });

    return res.status(201).json({
      token: token,
      verified: delivery.verified,
      email: delivery.email,
    });
  }

  return res.status(400).json({ message: "Error signing up!" });
};

/**-------------------- Delivery Login -------------------- */
export const deliveryLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginInput = plainToClass(DeliveryLoginInput, req.body);

  const loginErrors = await validate(loginInput, {
    validationError: { target: false },
  });

  if (loginErrors.length > 0) {
    return res.status(400).json(loginErrors);
  }

  const { email, password } = loginInput;
  const delivery = await Delivery.findOne({ email: email });

  if (delivery) {
    const validation = await ValidatePassword(
      password,
      delivery.password,
      delivery.salt
    );

    if (validation) {
      const token = GenerateToken({
        _id: delivery._id,
        email: delivery.email,
        verified: delivery.verified,
      });

      return res.status(200).json({
        token: token,
        email: delivery.email,
        verified: delivery.verified,
      });
    }
    return res.status(401).json({ message: "Invalid login credentials!" });
  }
  return res.status(404).json({ message: "Invalid user!" });
};

/**-------------------- Change Service Status -------------------- */
export const changeServiceStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const delivery = req.user;

  if (delivery) {
    const { lat, lng } = req.body;
    const profile = await Delivery.findById(delivery._id);

    if (profile) {
      if (lat && lng) {
        profile.lat = lat;
        profile.lng = lng;
      }

      profile.isAvailable = !profile.isAvailable;
      const result = await profile.save();
      return res.status(200).json(result);
    }
  }

  return res.status(400).json({ message: "Error updating service status!" });
};

/**-------------------- Get Delivery Profile -------------------- */
export const getDeliveryProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const delivery = req.user;

  if (delivery) {
    const profile = await Delivery.findById(delivery._id);

    return res.status(200).json(profile);
  }

  return res.status(404).json({ message: "No Delivery Data Found!" });
};

/**-------------------- Update Delivery Profile -------------------- */
export const updateDeliveryProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  const profileInput = plainToClass(EditDeliveryInput, req.body);
  const profileErrors = await validate(profileInput, {
    validationError: { target: false },
  });

  if (profileErrors.length > 0) {
    return res.status(400).json(profileErrors);
  }

  const { firstName, lastName, address } = profileInput;

  if (customer) {
    const profile = await Delivery.findById(customer._id);
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
