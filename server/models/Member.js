import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    plan: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    trainerRequired: {
      type: Boolean,
      default: false,
    },
    membershipStartedAt: {
      type: String,
      required: true,
    },
    membershipExpiresAt: {
      type: String,
      required: true,
    },
    lastVisit: {
      type: String,
      default: "New member",
    },
    checkedIn: {
      type: Boolean,
      default: false,
    },
    dueAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    dueDate: {
      type: String,
      default: "Paid",
    },
  },
  {
    timestamps: true,
  },
);

const Member = mongoose.model("Member", memberSchema);

export { Member };
