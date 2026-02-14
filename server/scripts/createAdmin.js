import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import connectDB from "../config/db.js";

dotenv.config();

const createAdminUser = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("Admin user already exists:");
      console.log("Email:", existingAdmin.email);
      console.log(
        "\nIf you forgot the password, you can update it manually in the database.",
      );
      process.exit(0);
    }

    // Prompt for admin details
    const adminData = {
      name: "Admin",
      email: "admin@example.com",
      password: "admin123", // Change this to a secure password
      role: "admin",
      isActive: true,
    };

    const admin = await User.create(adminData);

    console.log("✅ Admin user created successfully!");
    console.log("\nAdmin Credentials:");
    console.log("Email:", admin.email);
    console.log("Password: admin123");
    console.log(
      "\n⚠️  IMPORTANT: Change the password immediately after first login!",
    );
    console.log(
      "\nYou can now login to the admin panel at: http://localhost:3002",
    );

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

createAdminUser();
