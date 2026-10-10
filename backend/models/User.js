import mongoose from "mongoose";

const baseUserFields = {
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true, minlength: 6 },
  role: {
    type: String,
    enum: ["student", "faculty", "admin"],
    required: true,
  },
  phone: { type: String, trim: true, default: "" },
};

const studentSchema = new mongoose.Schema(
  {
    ...baseUserFields,
    role: { type: String, enum: ["student"], default: "student" },
    rollNo: { type: String, trim: true, default: "" },
    department: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

const facultySchema = new mongoose.Schema(
  {
    ...baseUserFields,
    role: { type: String, enum: ["faculty"], default: "faculty" },
    department: { type: String, trim: true, required: true },
    designation: { type: String, trim: true, default: "Professor" },
    bio: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

const adminSchema = new mongoose.Schema(
  {
    ...baseUserFields,
    role: { type: String, enum: ["admin"], default: "admin" },
  },
  { timestamps: true }
);

export const Student = mongoose.model("Student", studentSchema);
export const Faculty = mongoose.model("Faculty", facultySchema);
export const Admin = mongoose.model("Admin", adminSchema);
