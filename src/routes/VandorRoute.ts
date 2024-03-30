import express, { Request, Response, NextFunction } from "express";
import {
  VandorLogin,
  createFood,
  getVandorProfile,
  updateVandorProfile,
  updateVandorService,
} from "../controllers";
import { Authenticate } from "../middlewares";

const router = express.Router();

router.post("/login", VandorLogin);

router.use(Authenticate);
router.get("/profile", getVandorProfile);
router.patch("/profile", updateVandorProfile);
router.patch("/service", updateVandorService);

router.post("/food", createFood);
router.get("/foods");

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send({ message: "Vandor Route" });
});

export { router as VandorRoute };
