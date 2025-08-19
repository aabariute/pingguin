import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "../lib/appError.js";
import { catchAsync, generateToken } from "../lib/utils.js";
import User, { UserDocument } from "../models/user.model.js";

interface TokenPayload extends jwt.JwtPayload {
  id: string;
}

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { identifierType, identifier, password } = req.body;

    if (!identifierType || !identifier || !password) {
      return next(
        new AppError(
          "Please provide login identifierType, identifier and password",
          400
        )
      );
    }

    let user: UserDocument;

    if (identifierType === "email") {
      user = await User.findOne({ email: identifier }).select("+password");
    } else if (identifierType === "nickname") {
      user = await User.findOne({ nickname: identifier }).select("+password");
    } else {
      return next(new AppError("Invalid identifier type", 400));
    }

    const correct =
      user && (await user.isCorrectPassword(user.password, password));

    if (!user || !correct) {
      return next(new AppError("Wrong credentials", 401));
    }

    const token = generateToken(user._id, res);
    user.password = undefined;

    res.status(200).json({
      success: true,
      token,
      data: user,
    });
  }
);

export const signup = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { nickname, email, password, passwordConfirm } = req.body;

    const newUser: UserDocument = await User.create({
      nickname,
      email,
      password,
      passwordConfirm,
    });

    const token = generateToken(newUser._id, res);
    newUser.password = undefined;

    res.status(200).json({
      success: true,
      token,
      data: newUser,
    });
  }
);

export const logout = (_req: Request, res: Response) => {
  res.cookie("jwt", "", { maxAge: 0 });

  res.status(200).json({ success: true });
};

export const protect = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError("You are not logged in. Please login to get access.", 401)
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as TokenPayload;

    const user: UserDocument = await User.findById(decoded.id);

    if (!user) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401
        )
      );
    }

    // Check if user changed password after the JWT token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          "User has recently changed password. Please login again",
          401
        )
      );
    }

    req.user = user;

    next();
  }
);

export const isNicknameAvailabe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { nickname } = req.body;

    if (!nickname) return next(new AppError("Nickname is required", 400));

    const user = await User.findOne({ nickname });

    if (user) return res.status(200).json({ success: false });

    res.status(200).json({ success: true });
  }
);

export const verifyAuth = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }

    res.status(200).json({
      success: true,
      data: req.user,
    });
  }
);
