import express, { Application } from "express";
import path from "path";

import {
  AdminRoute,
  CustomerRoute,
  DeliveryRoute,
  ShoppingRoute,
  VendorRoute,
} from "../routes";

export default async (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const imagePath = path.join(__dirname, "../images");

  app.use("/images", express.static(imagePath));

  app.use("/admin", AdminRoute);
  app.use("/vendor", VendorRoute);

  app.use("/customer", CustomerRoute);
  app.use(ShoppingRoute);

  app.use("/delivery", DeliveryRoute);

  return app;
};
