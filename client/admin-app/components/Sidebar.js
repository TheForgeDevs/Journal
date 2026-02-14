"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";

const Sidebar = () => {
  const pathname = usePathname();
  const { admin, logout } = useAdmin();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Users", href: "/dashboard/users", icon: "👥" },
    { name: "Courses", href: "/dashboard/courses", icon: "📚" },
    { name: "Enrollments", href: "/dashboard/enrollments", icon: "✅" },
    { name: "Payments", href: "/dashboard/payments", icon: "💰" },
    { name: "Reviews", href: "/dashboard/reviews", icon: "⭐" },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-sm text-gray-400 mt-1">LMS Management</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {admin?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-sm">{admin?.name}</p>
            <p className="text-xs text-gray-400">{admin?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
