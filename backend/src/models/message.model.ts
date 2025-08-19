import { Document, model, Schema, Types } from "mongoose";

export interface MessageInput {
  messageText?: string;
  images?: Array<string>;
}

export interface MessageDocument extends MessageInput, Document {
  _id: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema(
  {
    senderId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    messageText: String,
    images: [String],
  },
  { timestamps: true }
);

const Message = model<MessageDocument>("Message", messageSchema);

export default Message;
