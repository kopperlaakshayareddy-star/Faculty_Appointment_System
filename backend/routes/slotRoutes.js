import { Router } from "express";
import { body } from "express-validator";
import {
  createSlot,
  getMySlots,
  deleteSlot,
  getFacultySlots,
} from "../controllers/slotController.js";
import { protect, authorize } from "../middleware/auth.js";
import { handleValidation } from "../middleware/validation.js";

const router = Router();

router.post(
  "/",
  protect,
  authorize("faculty"),
  [
    body("date").notEmpty().withMessage("Date is required"),
    body("startTime").notEmpty().withMessage("Start time is required"),
    body("endTime").notEmpty().withMessage("End time is required"),
  ],
  handleValidation,
  createSlot
);

router.get("/my", protect, authorize("faculty"), getMySlots);
router.delete("/:id", protect, authorize("faculty"), deleteSlot);
router.get("/faculty/:id", protect, getFacultySlots);

export default router;
