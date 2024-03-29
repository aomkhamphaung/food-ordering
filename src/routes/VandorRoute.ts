import express, { Request, Response, NextFunction } from "express";
import { VandorLogin } from "../controllers";

const router = express.Router();

router.post("/login", VandorLogin);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send({ message: "Vandor Route" });
});

export { router as VandorRoute };
