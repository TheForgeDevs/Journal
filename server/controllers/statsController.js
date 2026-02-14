import User from "../models/User.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Review from "../models/Review.js";
import Payment from "../models/Payment.js";
import { catchAsync } from "../utils/catchAsync.js";

// @desc    Get platform statistics (public)
// @route   GET /api/stats/platform
// @access  Public
export const getPlatformStats = catchAsync(async (req, res) => {
  // Count total active tutors
  const totalTutors = await User.countDocuments({
    role: "tutor",
    isActive: true,
  });

  // Count total published courses
  const totalCourses = await Course.countDocuments({
    isPublished: true,
    isArchived: false,
  });

  // Count total active students
  const totalStudents = await User.countDocuments({
    role: "student",
    isActive: true,
  });

  // Count total enrollments
  const totalEnrollments = await Enrollment.countDocuments();

  // Get average course rating
  const courses = await Course.find({
    isPublished: true,
    isArchived: false,
    numReviews: { $gt: 0 },
  }).select("rating numReviews");

  const avgRating =
    courses.length > 0
      ? courses.reduce((sum, c) => sum + c.rating, 0) / courses.length
      : 0;

  // Get top categories
  const categoryStats = await Course.aggregate([
    { $match: { isPublished: true, isArchived: false } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalTutors,
      totalCourses,
      totalStudents,
      totalEnrollments,
      avgRating: Math.round(avgRating * 10) / 10,
      topCategories: categoryStats,
    },
  });
});

// @desc    Get recent reviews (public)
// @route   GET /api/stats/reviews
// @access  Public
export const getPublicReviews = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 6;

  const reviews = await Review.find()
    .populate("student", "name avatar")
    .populate("course", "title category")
    .sort({ createdAt: -1 })
    .limit(limit);

  res.status(200).json({
    success: true,
    data: { reviews },
  });
});

// @desc    Get admin dashboard statistics
// @route   GET /api/stats/admin-dashboard
// @access  Private/Admin
export const getAdminDashboardStats = catchAsync(async (req, res) => {
  // Count users by role
  const totalUsers = await User.countDocuments();
  const studentCount = await User.countDocuments({ role: "student" });
  const tutorCount = await User.countDocuments({ role: "tutor" });
  const adminCount = await User.countDocuments({ role: "admin" });

  // Count courses
  const totalCourses = await Course.countDocuments();
  const publishedCourses = await Course.countDocuments({ isPublished: true });
  const draftCourses = await Course.countDocuments({ isPublished: false });

  // Count enrollments
  const activeEnrollments = await Enrollment.countDocuments({
    status: "active",
  });
  const totalEnrollments = await Enrollment.countDocuments();

  // Payment statistics
  const completedPayments = await Payment.countDocuments({
    status: "completed",
  });
  const pendingPayments = await Payment.countDocuments({ status: "pending" });
  const failedPayments = await Payment.countDocuments({ status: "failed" });

  // Calculate total revenue
  const revenueResult = await Payment.aggregate([
    { $match: { status: "completed" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

  // Calculate average course rating
  const courses = await Course.find({ numReviews: { $gt: 0 } }).select(
    "rating numReviews",
  );
  const averageRating =
    courses.length > 0
      ? courses.reduce((sum, c) => sum + c.rating, 0) / courses.length
      : 0;

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      studentCount,
      tutorCount,
      adminCount,
      totalCourses,
      publishedCourses,
      draftCourses,
      activeEnrollments,
      totalEnrollments,
      completedPayments,
      pendingPayments,
      failedPayments,
      totalRevenue,
      averageRating: Math.round(averageRating * 10) / 10,
    },
  });
});
