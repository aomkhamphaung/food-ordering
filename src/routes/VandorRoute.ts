import express, { Request, Response, NextFunction } from "express";
import {
  vandorLogin,
  createFood,
  getVandorProfile,
  updateVandorProfile,
  updateVandorService,
  getFoods,
} from "../controllers";
import { Authenticate } from "../middlewares";
import multer from "multer";

const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/images");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + "_" + file.originalname);
  },
});

const images = multer({ storage: imageStorage }).array("images", 10);

router.post("/login", vandorLogin);

router.use(Authenticate);
router.get("/profile", getVandorProfile);
router.patch("/profile", updateVandorProfile);
router.patch("/service", updateVandorService);

router.post("/food", images, createFood);
router.get("/foods", getFoods);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send({ message: "Vandor Route" });
});

export { router as VandorRoute };
