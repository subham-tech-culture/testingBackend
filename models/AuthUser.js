import mongoose from "mongoose";

const authuser = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: String,
  otpExpiry: Date
}, { timestamps: true });

export default mongoose.model("authuser", authuser);
