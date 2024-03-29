import { Request, Response, NextFunction } from "express";
import { AuthPayload } from "../dto/Auth.dto";
import { VerifyToken } from "../utility";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const Authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = await VerifyToken(req);
  if (validate) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthenticated!" });
  }
};
