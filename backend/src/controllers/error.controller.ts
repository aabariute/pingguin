import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import AppError from "../lib/appError.js";

function asAny(e: unknown): any {
  return e as any;
}

// mongoose errors
const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map(
    (el: mongoose.Error.ValidatorError) => el.message
  );
  const message = `Invalid input data: ${errors.join(". ")}`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
  const value = err.errorResponse.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;

  return new AppError(message, 400);
};

// jwt errors
const handleJWTError = () => {
  return new AppError("Invalid token. Please login again", 401);
};

const handleJWTExpiredError = () => {
  return new AppError("Your token has expired. Please login again", 401);
};

const sendErrorDev = (err: any, res: Response) => {
  res.status(err.statusCode).json({
    success: err.success,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: any, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
    });
  } else {
    console.error("ERROR 🧨", err);
    res.status(500).json({
      success: err.success,
      message: "Something went wrong!",
    });
  }
};

export default function globalErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const e = asAny(err);
  e.statusCode = e.statusCode || 500;
  // console.log({ errName: e.name });

  if (process.env.NODE_ENV === "development") {
    console.log("🔶 In Development environment 🔶");

    sendErrorDev(e, res);
  } else if (process.env.NODE_ENV === "production") {
    console.log("🔷 In Production environment 🔷");

    let error: any = { ...e, message: e.message };

    if (e instanceof mongoose.Error.CastError) {
      error = handleCastErrorDB(e);
    }
    if (e instanceof mongoose.Error.ValidationError) {
      error = handleValidationErrorDB(e);
    }
    if (e.errorResponse?.code === 11000) {
      error = handleDuplicateFieldsDB(e);
    }
    if (e.name === "JsonWebTokenError") {
      error = handleJWTError();
    }
    if (e.name === "TokenExpiredError") {
      error = handleJWTExpiredError();
    }

    sendErrorProd(error, res);
  }
}
