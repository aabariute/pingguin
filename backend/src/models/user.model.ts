import bcrypt from "bcrypt";
import {
  CallbackWithoutResultAndOptionalError,
  Document,
  model,
  Query,
  Schema,
  Types,
} from "mongoose";
import validator from "validator";

export interface UserInput {
  nickname?: string;
  email?: string;
  password: string;
  passwordConfirm?: string;
}

export interface UserDocument extends UserInput, Document {
  _id: Types.ObjectId;
  passwordChangedAt: Date;
  avatar?: string;
  active?: boolean;
  createdAt: Date;
  updatedAt: Date;

  isCorrectPassword(
    userPassword: string,
    enteredPassword: string
  ): Promise<boolean>;
  changedPasswordAfter(jwtTimestamp: number): boolean;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid email"],
    },
    nickname: {
      type: String,
      required: [true, "Nickname is required"],
      unique: true,
      minLength: [5, "Nickname must have greater or equal than 5 characters"],
      maxLength: [12, "Nickname must have less or equal than 12 characters"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (val: string): boolean {
          return val === this.password;
        },
        message: "Password does not match",
      },
    },
    passwordChangedAt: Date,
    avatar: String,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre(
  "save",
  async function (
    this: UserDocument,
    next: CallbackWithoutResultAndOptionalError
  ) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    this.passwordConfirm = undefined;

    next();
  }
);

userSchema.pre(
  "save",
  function (this: UserDocument, next: CallbackWithoutResultAndOptionalError) {
    if (!this.isModified("password") || this.isNew) {
      return next();
    }

    this.passwordChangedAt = new Date(Date.now() - 1000); // Set as a Date (and subtract 1s to avoid token race conditions)

    next();
  }
);

userSchema.pre(
  /^find/,
  function (
    this: Query<any, UserDocument>,
    next: CallbackWithoutResultAndOptionalError
  ) {
    this.find({ active: { $ne: false } });

    next();
  }
);

userSchema.methods.isCorrectPassword = async function (
  userPassword: string,
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (
  this: UserDocument,
  jwtTimestamp: number
): boolean {
  const changedMs = this.passwordChangedAt?.getTime();
  if (!changedMs) return false; // No password change recorded (treat as not changed after token was issued)

  const changedTimestamp = Math.floor(changedMs / 1000); // Convert milliseconds to seconds

  return changedTimestamp > jwtTimestamp; // If true, than user has changed his password (invalidate token)
};

const User = model<UserDocument>("User", userSchema);

export default User;
