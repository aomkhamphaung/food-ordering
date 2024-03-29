import express, { Request, Response, NextFunction } from "express";
import {
  VandorLogin,
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

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send({ message: "Vandor Route" });
});

export { router as VandorRoute };
