import { Router } from "express";
import {
  getAllStudents,
  deleteStudent,
  getAllFaculty,
  getFacultyById,
  deleteFaculty,
  getDepartments,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

// Public to authenticated users: list faculty
router.get("/faculty", protect, getAllFaculty);
router.get("/faculty/:id", protect, getFacultyById);
router.get("/departments", protect, getDepartments);

// Admin only
router.get("/students", protect, authorize("admin"), getAllStudents);
router.delete("/students/:id", protect, authorize("admin"), deleteStudent);
router.delete("/faculty/:id", protect, authorize("admin"), deleteFaculty);

export default router;
