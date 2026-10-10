import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      default: null,
    },
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true }, // HH:mm
    purpose: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled", "rescheduled"],
      default: "pending",
    },
    rescheduleNote: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

appointmentSchema.index({ student: 1, date: -1 });
appointmentSchema.index({ faculty: 1, date: 1 });

export const Appointment = mongoose.model("Appointment", appointmentSchema);
