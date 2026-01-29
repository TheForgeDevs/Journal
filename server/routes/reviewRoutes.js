import express from "express";
import Review from "../models/Review.js";
import Course from "../models/Course.js";
import { protect, restrictTo } from "../middleware/auth.js";
import { catchAsync } from "../utils/catchAsync.js";

const router = express.Router();
router.use(protect);

// 1. GET Reviews for Tutor
router.get("/tutor", restrictTo("tutor"), catchAsync(async (req, res) => {
  const courses = await Course.find({ tutor: req.user._id }).select('_id');
  const courseIds = courses.map(c => c._id);

  const reviews = await Review.find({ course: { $in: courseIds } })
    .populate("student", "name avatar")
    .populate("course", "title")
    .sort("-createdAt");

  res.status(200).json({ success: true, data: reviews });
}));

// 2. REPLY to Review
router.patch("/:id/reply", restrictTo("tutor"), catchAsync(async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id, 
    { tutorReply: req.body.reply },
    { new: true }
  );
  res.status(200).json({ success: true, data: review });
}));

export default router;