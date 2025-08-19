import { NextFunction, Request, Response } from "express";
import AppError from "../lib/appError.js";
import cloudinary from "../lib/cloudinary.js";
import { catchAsync, generateToken } from "../lib/utils.js";
import User, { UserDocument } from "../models/user.model.js";

export const getUsers = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const users: Array<UserDocument> = await User.find().where({
      _id: { $ne: req.user.id },
    });

    res.status(200).json({
      success: true,
      results: users.length,
      data: users,
    });
  }
);

export const updateUserAvatar = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const avatar = req.body.avatar;
    const userId = req.user.id;

    if (!avatar) {
      return next(new AppError("Profile picture is required", 400));
    }

    if (!/^data:image\/[a-zA-Z]+;base64,/.test(avatar)) {
      return next(new AppError("Invalid image format", 400));
    }

    let uploadRes;

    try {
      uploadRes = await cloudinary.uploader.upload(avatar, {
        resource_type: "image",
      });
    } catch (err) {
      console.error("Cloudinary upload error: ", err);
      return next(new AppError("Image could not be uploaded", 400));
    }

    const updatedUser: UserDocument = await User.findByIdAndUpdate(
      userId,
      { avatar: uploadRes.secure_url },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  }
);

export const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { passwordCurrent, passwordNew, passwordConfirm } = req.body;

    if (!passwordCurrent || !passwordNew || !passwordConfirm) {
      return next(new AppError("All fields are required", 400));
    }

    const user: UserDocument = await User.findOne({ _id: req.user._id }).select(
      "+password"
    );

    if (!(await user.isCorrectPassword(user.password, passwordCurrent))) {
      return next(
        new AppError("Incorrect current password. Please try again.", 400)
      );
    }

    if (passwordCurrent === passwordNew) {
      return next(
        new AppError("New password cannot be the same as the current one", 400)
      );
    }

    user.password = passwordNew;
    user.passwordConfirm = passwordConfirm;

    await user.save();

    const token = generateToken(user._id, res);
    user.password = undefined;

    res.status(200).json({
      success: true,
      token,
      data: user,
    });
  }
);

export const deleteAccount = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { passwordCurrent } = req.body;

    if (!passwordCurrent) {
      return next(new AppError("Current password is required", 400));
    }

    const user: UserDocument = await User.findOne({ _id: req.user._id }).select(
      "+password"
    );

    if (!(await user.isCorrectPassword(user.password, passwordCurrent))) {
      return next(
        new AppError("Incorrect current password. Please try again.", 400)
      );
    }

    await User.findByIdAndUpdate(req.user._id, { active: false });

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res.status(204).json({
      success: true,
      data: null,
    });
  }
);
