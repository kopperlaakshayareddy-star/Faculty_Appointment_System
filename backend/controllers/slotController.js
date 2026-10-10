import { Slot } from "../models/Slot.js";

// Faculty: create a slot
export async function createSlot(req, res) {
  const { date, startTime, endTime } = req.body;
  const facultyId = req.user._id;

  const existing = await Slot.findOne({
    faculty: facultyId,
    date,
    startTime,
  });
  if (existing) {
    return res
      .status(400)
      .json({ message: "A slot already exists for this date and time" });
  }

  const slot = await Slot.create({
    faculty: facultyId,
    date,
    startTime,
    endTime,
  });
  res.status(201).json(slot);
}

// Faculty: list own slots (with optional date filter)
export async function getMySlots(req, res) {
  const { date } = req.query;
  const filter = { faculty: req.user._id };
  if (date) filter.date = date;
  const slots = await Slot.find(filter).sort({ date: 1, startTime: 1 });
  res.json(slots);
}

// Faculty: delete a slot
export async function deleteSlot(req, res) {
  const slot = await Slot.findOne({
    _id: req.params.id,
    faculty: req.user._id,
  });
  if (!slot) return res.status(404).json({ message: "Slot not found" });
  if (slot.isBooked) {
    return res
      .status(400)
      .json({ message: "Cannot delete a booked slot" });
  }
  await Slot.findByIdAndDelete(req.params.id);
  res.json({ message: "Slot deleted" });
}

// Student: get available slots for a faculty member
export async function getFacultySlots(req, res) {
  const { date } = req.query;
  const filter = { faculty: req.params.id, isBooked: false };
  if (date) filter.date = date;
  const slots = await Slot.find(filter).sort({ date: 1, startTime: 1 });
  res.json(slots);
}
