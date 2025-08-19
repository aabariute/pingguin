import { NextFunction, Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import AppError from "../lib/appError.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { catchAsync } from "../lib/utils.js";
import Message, {
  MessageDocument,
  MessageInput,
} from "../models/message.model.js";
import User from "../models/user.model.js";

export const getMessages = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentUserId = req.user.id;
    const chatPartnerId = req.params.id;
    const skip = +req.query.skip || 0;

    if (!mongoose.isValidObjectId(chatPartnerId)) {
      return next(new AppError("No user found with this Id", 404));
    }

    const messages: Array<MessageDocument> = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: chatPartnerId },
        { senderId: chatPartnerId, receiverId: currentUserId },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(15);

    res.status(200).json({
      success: true,
      results: messages.length,
      data: messages,
    });
  }
);

export const sendMessage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const senderId = req.user.id;
    const receiverId = req.params.id;

    if (!mongoose.isValidObjectId(receiverId)) {
      return next(new AppError("No user found with this Id", 404));
    }

    if (receiverId === senderId) {
      return next(new AppError("Cannot message yourself", 400));
    }

    const receiverExists = await User.findById(receiverId);

    if (!receiverExists) {
      return next(new AppError("No user found with this id", 404));
    }

    const { messageText, images }: MessageInput = req.body;

    if (!messageText?.trim() && !images?.length) {
      return next(new AppError("Message cannot be empty", 400));
    }

    if (images?.length > 10) {
      return next(new AppError("Too many images (max 10)", 400));
    }

    if (images?.length > 0) {
      for (const image of images) {
        if (!/^data:image\/[a-zA-Z]+;base64,/.test(image)) {
          return next(new AppError("Invalid image format", 400));
        }
      }
    }

    let imageUrls: string[] = [];

    if (images?.length > 0) {
      try {
        for (const image of images) {
          const result = await cloudinary.uploader.upload(image, {
            resource_type: "image",
          });

          imageUrls.push(result.secure_url);
        }
      } catch (err) {
        console.error("Cloudinary upload error: ", err);
        return next(
          new AppError("One or more images could not be uploaded", 400)
        );
      }
    }

    const message = await Message.create({
      senderId,
      receiverId,
      messageText,
      images: imageUrls,
    });

    const receiverSocketId = getReceiverSocketId(receiverId);

    // If message receiver is online, then send the message in realtime
    if (receiverSocketId) {
      // only send the message to receiver
      io.to(receiverSocketId).emit("newMessage", message);
    }

    res.status(201).json({
      success: true,
      data: message,
    });
  }
);

export const getLastMessages = catchAsync(
  async (req: Request, res: Response) => {
    const userId = new Types.ObjectId(req.user.id);

    const messages = await Message.aggregate([
      { $match: { $or: [{ senderId: userId }, { receiverId: userId }] } },
      {
        $addFields: {
          chatPartnerId: {
            $cond: [{ $eq: ["$senderId", userId] }, "$receiverId", "$senderId"],
          },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$chatPartnerId",
          lastMessage: { $first: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          messageText: "$lastMessage.messageText",
          images: "$lastMessage.images",
          senderId: "$lastMessage.senderId",
          receiverId: "$lastMessage.receiverId",
          createdAt: "$lastMessage.createdAt",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: messages,
    });
  }
);
