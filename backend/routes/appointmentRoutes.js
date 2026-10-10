import { Router } from "express";
import { body } from "express-validator";
import {
  createAppointment,
  getMyAppointments,
  updateAppointment,
  cancelAppointment,
  getFacultyAppointments,
  updateAppointmentStatus,
  getAllAppointments,
  getAdminStats,
  getFacultyStats,
  getStudentStats,
} from "../controllers/appointmentController.js";
import { protect, authorize } from "../middleware/auth.js";
import { handleValidation } from "../middleware/validation.js";

const router = Router();

// Student routes
router.post(
  "/",
  protect,
  authorize("student"),
  [
    body("facultyId").notEmpty().withMessage("Faculty is required"),
    body("date").notEmpty().withMessage("Date is required"),
    body("time").notEmpty().withMessage("Time is required"),
    body("purpose")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Purpose must be at least 5 characters"),
  ],
  handleValidation,
  createAppointment
);
router.get("/my", protect, authorize("student"), getMyAppointments);
router.put("/my/:id", protect, authorize("student"), updateAppointment);
router.patch("/my/:id/cancel", protect, authorize("student"), cancelAppointment);

// Faculty routes
router.get(
  "/faculty",
  protect,
  authorize("faculty"),
  getFacultyAppointments
);
router.patch(
  "/:id/status",
  protect,
  authorize("faculty"),
  updateAppointmentStatus
);

// Admin routes
router.get("/", protect, authorize("admin"), getAllAppointments);

// Stats routes
router.get("/stats/admin", protect, authorize("admin"), getAdminStats);
router.get("/stats/faculty", protect, authorize("faculty"), getFacultyStats);
router.get("/stats/student", protect, authorize("student"), getStudentStats);

export default router;
