import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import userModel from "../models/userModel";
import { sendError } from "../utils/sendError";

export const isJwtAuthTokenExit = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.cookies?.jwtAutToken) {   
      const isTokenIsVerify: any = jwt.verify(
        req.cookies?.jwtAutToken,
        process.env.JWT_KEY || ""
      );
      if (isTokenIsVerify) {
        const userId = isTokenIsVerify.userId;
        const requestedUser = await userModel
          .findById(userId)
          .select("-password");
          console.log('-------------',requestedUser)
        req.user = requestedUser;
        next();
      } else {
        sendError(res, 401, "token not verified", null);
      }
    } else {
      sendError(res, 401, "Session expired. Please login.", null);
    }
  } catch (error: any) {
    sendError(res, 401, "Session expired. Please login again.", null);
  }
};
