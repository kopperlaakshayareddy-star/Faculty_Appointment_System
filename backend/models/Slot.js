import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },
    date: { type: String, required: true }, // YYYY-MM-DD
    startTime: { type: String, required: true }, // HH:mm
    endTime: { type: String, required: true }, // HH:mm
    isBooked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

slotSchema.index({ faculty: 1, date: 1, startTime: 1 }, { unique: true });

export const Slot = mongoose.model("Slot", slotSchema);
