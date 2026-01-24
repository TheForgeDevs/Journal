import Link from "next/link";
import { useRouter } from "next/router";
import { FiGrid, FiBookOpen, FiCreditCard, FiSettings, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext"; // Auth context se logout lenge

const Sidebar = () => {
  const router = useRouter();
  const { logout } = useAuth(); // Logout function

  const menuItems = [
    { name: "Dashboard", icon: FiGrid, href: "/user/profile" },
    { name: "Courses", icon: FiBookOpen, href: "/user/courses" },
    { name: "Payments", icon: FiCreditCard, href: "/user/payments" },
    { name: "Settings", icon: FiSettings, href: "/user/settings" },
  ];

  // URL rewrite ki wajah se pathname check kar rahe hain
  const isActive = (path) => router.asPath === path;

  return (
    <aside className="w-64 bg-[#181824] text-gray-400 flex-col justify-between p-6 h-screen sticky left-0 top-0 border-r border-gray-800 flex z-50">
      <div>

        {/* Navigation Links */}
        <nav className="space-y-3">
          {menuItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <span
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 cursor-pointer group font-medium ${
                  isActive(item.href)
                    ? "bg-[#6D28D9] text-white shadow-lg shadow-purple-900/50 translate-x-1"
                    : "hover:bg-[#2B2B40] hover:text-white hover:translate-x-1"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive(item.href) ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
                <span>{item.name}</span>
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <button 
        onClick={logout}
        className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 w-full text-gray-500 group mt-auto"
      >
        <FiLogOut className="w-5 h-5 group-hover:text-red-400" />
        <span className="font-medium">Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;