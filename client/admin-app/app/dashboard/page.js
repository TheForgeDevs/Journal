"use client";

import { useEffect, useState } from "react";
import { statsAPI } from "@/lib/api";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await statsAPI.getDashboard();
      setStats(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch statistics");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon, bgColor, textColor }) => (
    <div className={`${bgColor} rounded-xl shadow-md p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`${textColor} text-sm font-medium opacity-80`}>
            {title}
          </p>
          <p className={`${textColor} text-3xl font-bold mt-2`}>{value || 0}</p>
        </div>
        <div className={`text-4xl ${textColor} opacity-80`}>{icon}</div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome to the admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers}
          icon="👥"
          bgColor="bg-gradient-to-br from-blue-500 to-blue-600"
          textColor="text-white"
        />
        <StatCard
          title="Total Courses"
          value={stats?.totalCourses}
          icon="📚"
          bgColor="bg-gradient-to-br from-green-500 to-green-600"
          textColor="text-white"
        />
        <StatCard
          title="Active Enrollments"
          value={stats?.activeEnrollments}
          icon="✅"
          bgColor="bg-gradient-to-br from-purple-500 to-purple-600"
          textColor="text-white"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats?.totalRevenue?.toLocaleString() || 0}`}
          icon="💰"
          bgColor="bg-gradient-to-br from-orange-500 to-orange-600"
          textColor="text-white"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            User Distribution
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Students</span>
              <span className="font-bold text-blue-600">
                {stats?.studentCount || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tutors</span>
              <span className="font-bold text-green-600">
                {stats?.tutorCount || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Admins</span>
              <span className="font-bold text-purple-600">
                {stats?.adminCount || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Course Stats
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Published</span>
              <span className="font-bold text-green-600">
                {stats?.publishedCourses || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Draft</span>
              <span className="font-bold text-yellow-600">
                {stats?.draftCourses || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg Rating</span>
              <span className="font-bold text-orange-600">
                {stats?.averageRating?.toFixed(1) || 0} ⭐
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Payment Stats
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed</span>
              <span className="font-bold text-green-600">
                {stats?.completedPayments || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending</span>
              <span className="font-bold text-yellow-600">
                {stats?.pendingPayments || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Failed</span>
              <span className="font-bold text-red-600">
                {stats?.failedPayments || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
