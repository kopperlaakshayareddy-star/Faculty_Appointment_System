import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import config from "../config/index.js";
import { Student, Faculty, Admin } from "../models/User.js";
import { Slot } from "../models/Slot.js";
import { Appointment } from "../models/Appointment.js";
import mongoose from "mongoose";

async function seed() {
  await connectDB();

  await Promise.all([
    Student.deleteMany({}),
    Faculty.deleteMany({}),
    Admin.deleteMany({}),
    Slot.deleteMany({}),
    Appointment.deleteMany({}),
  ]);

  const salt = await bcrypt.genSalt(10);

  const admin = await Admin.create({
    name: "System Admin",
    email: "admin@university.edu",
    password: await bcrypt.hash("admin123", salt),
    role: "admin",
    phone: "555-0000",
  });

  const faculty1 = await Faculty.create({
    name: "Dr. Sarah Chen",
    email: "sarah.chen@university.edu",
    password: await bcrypt.hash("faculty123", salt),
    role: "faculty",
    department: "Computer Science",
    designation: "Associate Professor",
    bio: "Research in AI and machine learning.",
    phone: "555-1001",
  });

  const faculty2 = await Faculty.create({
    name: "Dr. James Miller",
    email: "james.miller@university.edu",
    password: await bcrypt.hash("faculty123", salt),
    role: "faculty",
    department: "Mathematics",
    designation: "Professor",
    bio: "Number theory and cryptography.",
    phone: "555-1002",
  });

  const faculty3 = await Faculty.create({
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@university.edu",
    password: await bcrypt.hash("faculty123", salt),
    role: "faculty",
    department: "Physics",
    designation: "Assistant Professor",
    bio: "Quantum computing and optics.",
    phone: "555-1003",
  });

  const student1 = await Student.create({
    name: "John Smith",
    email: "john.smith@university.edu",
    password: await bcrypt.hash("student123", salt),
    role: "student",
    rollNo: "CS2021-001",
    department: "Computer Science",
    phone: "555-2001",
  });

  const student2 = await Student.create({
    name: "Alice Johnson",
    email: "alice.johnson@university.edu",
    password: await bcrypt.hash("student123", salt),
    role: "student",
    rollNo: "MA2021-005",
    department: "Mathematics",
    phone: "555-2002",
  });

  // Create some slots
  const today = new Date();
  const formatDate = (d) => d.toISOString().split("T")[0];
  const dayFromNow = (n) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return formatDate(d);
  };

  const slots = [];
  for (const f of [faculty1, faculty2, faculty3]) {
    for (const day of [1, 2, 3]) {
      for (const [s, e] of [["09:00", "09:30"], ["10:00", "10:30"], ["14:00", "14:30"]]) {
        slots.push(
          await Slot.create({
            faculty: f._id,
            date: dayFromNow(day),
            startTime: s,
            endTime: e,
            isBooked: false,
          })
        );
      }
    }
  }

  // One booked appointment
  const appt = await Appointment.create({
    student: student1._id,
    faculty: faculty1._id,
    slot: slots[0]._id,
    date: dayFromNow(1),
    time: "09:00",
    purpose: "Discuss final year project on neural networks",
    status: "pending",
  });
  slots[0].isBooked = true;
  await slots[0].save();

  await Appointment.create({
    student: student2._id,
    faculty: faculty2._id,
    date: formatDate(today),
    time: "10:00",
    purpose: "Questions about calculus homework",
    status: "approved",
  });

  console.log("Seed complete!");
  console.log("Admin:   admin@university.edu / admin123");
  console.log("Faculty: sarah.chen@university.edu / faculty123");
  console.log("Student: john.smith@university.edu / student123");
  await mongoose.connection.close();
  process.exit(0);
}

seed();
