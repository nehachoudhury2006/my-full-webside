import mongoose from "mongoose";

const { Schema } = mongoose;

const appointmentSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    service: {
      type: String,
      trim: true,
      default: "",
    },
    bookingType: {
      type: String,
      trim: true,
      default: "",
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    numberOfPeople: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);
