import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { Student, Faculty, Admin } from "../models/User.js";

const models = { student: Student, faculty: Faculty, admin: Admin };

function issueToken(user, role) {
  return jwt.sign({ id: user._id, role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

function userResponse(user, role) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role,
    phone: user.phone,
    department: user.department,
    rollNo: user.rollNo,
    designation: user.designation,
    bio: user.bio,
  };
}

export async function register(req, res) {
  const { name, email, password, role, phone, department, rollNo, designation, bio } =
    req.body;

  const Model = models[role];
  if (!Model) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const existing = await Model.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const data = { name, email, password: hashed, phone };
  if (role === "student") {
    data.rollNo = rollNo || "";
    data.department = department || "";
  } else if (role === "faculty") {
    data.department = department || "General";
    data.designation = designation || "Professor";
    data.bio = bio || "";
  }

  const user = await Model.create(data);
  const token = issueToken(user, role);
  res.status(201).json({ token, user: userResponse(user, role) });
}

export async function login(req, res) {
  const { email, password, role } = req.body;

  const Model = models[role];
  if (!Model) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await Model.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = issueToken(user, role);
  res.json({ token, user: userResponse(user, role) });
}

export async function getMe(req, res) {
  res.json({ user: userResponse(req.user, req.user.role) });
}

export async function updateProfile(req, res) {
  const { name, phone, department, rollNo, designation, bio } = req.body;
  const Model = models[req.user.role];

  const updateFields = {};
  if (name) updateFields.name = name;
  if (phone) updateFields.phone = phone;
  if (req.user.role === "student") {
    if (department !== undefined) updateFields.department = department;
    if (rollNo !== undefined) updateFields.rollNo = rollNo;
  }
  if (req.user.role === "faculty") {
    if (department !== undefined) updateFields.department = department;
    if (designation !== undefined) updateFields.designation = designation;
    if (bio !== undefined) updateFields.bio = bio;
  }

  const user = await Model.findByIdAndUpdate(
    req.user._id,
    { $set: updateFields },
    { new: true }
  ).select("-password");

  res.json({ user: userResponse(user, req.user.role) });
}
