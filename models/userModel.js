import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  pan: String,
  dob: String,

  kycStatus: {
    type: String,
    enum: ["PAN_PENDING", "PAN_VERIFIED", "KYC_COMPLETED"],
    default: "PAN_PENDING"
  },

  digilocker: {
    verified: Boolean,
    aadhaarMasked: String,
    transactionId: String
  }

}, { timestamps: true });

export default mongoose.model("User", userSchema);
