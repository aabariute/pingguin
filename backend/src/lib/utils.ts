import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export const catchAsync = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: unknown) => next(err));
  };
};

export const generateToken = (userId: ObjectId, res: Response): string => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
