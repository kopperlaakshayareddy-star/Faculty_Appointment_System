import { Router } from "express";
import { body } from "express-validator";
import {
  register,
  login,
  getMe,
  updateProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { handleValidation } from "../middleware/validation.js";

const router = Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .isIn(["student", "faculty"])
      .withMessage("Role must be student or faculty"),
  ],
  handleValidation,
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("role")
      .isIn(["student", "faculty", "admin"])
      .withMessage("Role is required"),
  ],
  handleValidation,
  login
);

router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

export default router;
