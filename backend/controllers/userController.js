import { Student, Faculty } from "../models/User.js";
import { Appointment } from "../models/Appointment.js";

// Admin: list all students
export async function getAllStudents(req, res) {
  const { search } = req.query;
  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { rollNo: { $regex: search, $options: "i" } },
    ];
  }
  const students = await Student.find(filter)
    .select("-password")
    .sort({ createdAt: -1 });
  res.json(students);
}

// Admin: delete a student
export async function deleteStudent(req, res) {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });
  await Appointment.deleteMany({ student: req.params.id });
  res.json({ message: "Student deleted" });
}

// Public/Student: list all faculty
export async function getAllFaculty(req, res) {
  const { search, department } = req.query;
  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { department: { $regex: search, $options: "i" } },
    ];
  }
  if (department) filter.department = department;
  const faculty = await Faculty.find(filter)
    .select("-password")
    .sort({ name: 1 });
  res.json(faculty);
}

// Public/Student: get single faculty
export async function getFacultyById(req, res) {
  const faculty = await Faculty.findById(req.params.id).select("-password");
  if (!faculty) return res.status(404).json({ message: "Faculty not found" });
  res.json(faculty);
}

// Admin: delete faculty
export async function deleteFaculty(req, res) {
  const faculty = await Faculty.findByIdAndDelete(req.params.id);
  if (!faculty) return res.status(404).json({ message: "Faculty not found" });
  await Appointment.deleteMany({ faculty: req.params.id });
  res.json({ message: "Faculty deleted" });
}

// Admin: get all departments
export async function getDepartments(req, res) {
  const depts = await Faculty.distinct("department");
  res.json(depts);
}
