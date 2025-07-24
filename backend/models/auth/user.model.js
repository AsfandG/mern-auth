import { genSalt } from "bcrypt";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please provide your name"],
    },
    email: {
      type: String,
      required: [true, "please provide an email"],
      unique: true,
      trim: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "please provide your password!"],
    },
    photo: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
    },
    bio: {
      type: String,
      default: "Hey there I am new user.",
    },
    role: {
      type: String,
      enum: ["user", "admin", "creator"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, minimize: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model("user", UserSchema);

export default User;
