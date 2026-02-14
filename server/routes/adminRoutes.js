import express from "express";
import {
  adminLogin,
  getAdminProfile,
  changeAdminPassword,
  adminLogout,
} from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/login", adminLogin);

// Protected routes
router.use(protectAdmin); // All routes after this are protected for admin
router.get("/me", getAdminProfile);
router.get("/profile", getAdminProfile);
router.post("/change-password", changeAdminPassword);
router.post("/logout", adminLogout);

export default router;
