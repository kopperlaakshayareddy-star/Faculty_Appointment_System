import { Appointment } from "../models/Appointment.js";
import { Slot } from "../models/Slot.js";
import { Student, Faculty } from "../models/User.js";

// Student: create an appointment
export async function createAppointment(req, res) {
  const { facultyId, date, time, purpose, slotId } = req.body;

  const faculty = await Faculty.findById(facultyId);
  if (!faculty) {
    return res.status(404).json({ message: "Faculty not found" });
  }

  // Check for duplicate booking by same student on same date+time+faculty
  const dup = await Appointment.findOne({
    student: req.user._id,
    faculty: facultyId,
    date,
    time,
    status: { $in: ["pending", "approved"] },
  });
  if (dup) {
    return res
      .status(400)
      .json({ message: "You already have an appointment at this time" });
  }

  let slot = null;
  if (slotId) {
    slot = await Slot.findById(slotId);
    if (!slot || slot.isBooked || String(slot.faculty) !== String(facultyId)) {
      return res.status(400).json({ message: "Invalid or unavailable slot" });
    }
  }

  const appointment = await Appointment.create({
    student: req.user._id,
    faculty: facultyId,
    slot: slotId || null,
    date,
    time,
    purpose,
  });

  if (slot) {
    slot.isBooked = true;
    await slot.save();
  }

  const populated = await Appointment.findById(appointment._id)
    .populate("student", "name email phone rollNo department")
    .populate("faculty", "name email department designation");
  res.status(201).json(populated);
}

// Student: get own appointments
export async function getMyAppointments(req, res) {
  const { status } = req.query;
  const filter = { student: req.user._id };
  if (status) filter.status = status;
  const appointments = await Appointment.find(filter)
    .populate("faculty", "name email department designation")
    .sort({ date: -1, time: 1 });
  res.json(appointments);
}

// Student: update appointment (only if pending)
export async function updateAppointment(req, res) {
  const { date, time, purpose } = req.body;
  const appointment = await Appointment.findOne({
    _id: req.params.id,
    student: req.user._id,
  });

  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }
  if (!["pending", "approved"].includes(appointment.status)) {
    return res
      .status(400)
      .json({ message: "Cannot edit this appointment" });
  }

  if (date) appointment.date = date;
  if (time) appointment.time = time;
  if (purpose) appointment.purpose = purpose;
  await appointment.save();

  const updated = await Appointment.findById(appointment._id)
    .populate("student", "name email phone rollNo department")
    .populate("faculty", "name email department designation");
  res.json(updated);
}

// Student: cancel appointment
export async function cancelAppointment(req, res) {
  const appointment = await Appointment.findOne({
    _id: req.params.id,
    student: req.user._id,
  });
  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }
  if (appointment.status === "cancelled") {
    return res.status(400).json({ message: "Already cancelled" });
  }

  appointment.status = "cancelled";
  await appointment.save();

  // Free up the slot if one was booked
  if (appointment.slot) {
    await Slot.findByIdAndUpdate(appointment.slot, { isBooked: false });
  }

  res.json({ message: "Appointment cancelled" });
}

// Faculty: get appointments for logged-in faculty
export async function getFacultyAppointments(req, res) {
  const { status, date } = req.query;
  const filter = { faculty: req.user._id };
  if (status) filter.status = status;
  if (date) filter.date = date;
  const appointments = await Appointment.find(filter)
    .populate("student", "name email phone rollNo department")
    .populate("faculty", "name email department designation")
    .sort({ date: 1, time: 1 });
  res.json(appointments);
}

// Faculty: approve / reject / reschedule
export async function updateAppointmentStatus(req, res) {
  const { status, newDate, newTime, note } = req.body;
  const appointment = await Appointment.findOne({
    _id: req.params.id,
    faculty: req.user._id,
  });
  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  const validStatuses = ["approved", "rejected", "rescheduled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  appointment.status = status;

  if (status === "rescheduled") {
    if (newDate) appointment.date = newDate;
    if (newTime) appointment.time = newTime;
    if (note) appointment.rescheduleNote = note;
  }

  if (status === "rejected" && appointment.slot) {
    await Slot.findByIdAndUpdate(appointment.slot, { isBooked: false });
  }

  await appointment.save();

  const updated = await Appointment.findById(appointment._id)
    .populate("student", "name email phone rollNo department")
    .populate("faculty", "name email department designation");
  res.json(updated);
}

// Admin: get all appointments
export async function getAllAppointments(req, res) {
  const { status, date, facultyId, studentId, search } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (date) filter.date = date;
  if (facultyId) filter.faculty = facultyId;
  if (studentId) filter.student = studentId;

  let query = Appointment.find(filter)
    .populate("student", "name email phone rollNo department")
    .populate("faculty", "name email department designation")
    .sort({ date: -1, time: 1 });

  const appointments = await query.exec();

  let result = appointments;
  if (search) {
    const s = search.toLowerCase();
    result = appointments.filter(
      (a) =>
        a.student?.name?.toLowerCase().includes(s) ||
        a.faculty?.name?.toLowerCase().includes(s) ||
        a.purpose?.toLowerCase().includes(s)
    );
  }

  res.json(result);
}

// Admin: dashboard stats
export async function getAdminStats(req, res) {
  const totalStudents = await Student.countDocuments();
  const totalFaculty = await Faculty.countDocuments();
  const totalAppointments = await Appointment.countDocuments();

  const statusCounts = await Appointment.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = await Appointment.countDocuments({
    date: today,
    status: { $in: ["pending", "approved", "rescheduled"] },
  });

  const statusStats = {};
  statusCounts.forEach((s) => {
    statusStats[s._id] = s.count;
  });

  res.json({
    totalStudents,
    totalFaculty,
    totalAppointments,
    todayAppointments,
    statusStats,
  });
}

// Faculty: dashboard stats
export async function getFacultyStats(req, res) {
  const today = new Date().toISOString().split("T")[0];
  const filter = { faculty: req.user._id };

  const total = await Appointment.countDocuments(filter);
  const todayCount = await Appointment.countDocuments({
    ...filter,
    date: today,
    status: { $in: ["pending", "approved", "rescheduled"] },
  });
  const pending = await Appointment.countDocuments({
    ...filter,
    status: "pending",
  });
  const approved = await Appointment.countDocuments({
    ...filter,
    status: "approved",
  });

  const todayAppointments = await Appointment.find({
    ...filter,
    date: today,
  })
    .populate("student", "name email phone rollNo")
    .sort({ time: 1 });

  res.json({
    total,
    todayCount,
    pending,
    approved,
    todayAppointments,
  });
}

// Student: dashboard stats
export async function getStudentStats(req, res) {
  const filter = { student: req.user._id };
  const total = await Appointment.countDocuments(filter);
  const pending = await Appointment.countDocuments({
    ...filter,
    status: "pending",
  });
  const approved = await Appointment.countDocuments({
    ...filter,
    status: "approved",
  });
  const upcoming = await Appointment.find({
    ...filter,
    status: { $in: ["pending", "approved"] },
  })
    .populate("faculty", "name department designation")
    .sort({ date: 1, time: 1 })
    .limit(5);

  res.json({ total, pending, approved, upcoming });
}
