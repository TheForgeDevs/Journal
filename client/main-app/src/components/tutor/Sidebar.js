import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { LayoutDashboard, BookOpen, Users, IndianRupee, Star, UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { name: 'Dashboard', path: '/tutor/dashboard', icon: LayoutDashboard },
  { name: 'My Courses', path: '/tutor/courses', icon: BookOpen },
  { name: 'Learners', path: '/tutor/learners', icon: Users },
  { name: 'Payments', path: '/tutor/payments', icon: IndianRupee },
  { name: 'Reviews', path: '/tutor/reviews', icon: Star },
  { name: 'Profile', path: '/tutor/profile', icon: UserCircle },
];

export default function TutorSidebar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <div className="w-64 lg:w-72 p-6 flex flex-col overflow-y-auto bg-linear-to-b from-[#1E1E2E] to-[#161620] border-r border-gray-800/50 h-screen">
      
      {/* Header with Logo/Branding */}
      <div className="mb-10">
        <Image 
          src="/logo.png" 
          alt="Journal Logo" 
          width={150} 
          height={50} 
          className="object-contain"
          priority
        />
        <p className="text-xs text-gray-400 mt-2 font-semibold uppercase tracking-wider">Tutor Dashboard</p>
      </div>

      {/* User Info Card */}
      {user && (
        <div className="mb-8 p-4 bg-linear-to-br from-purple-900/40 to-pink-900/40 rounded-2xl border border-purple-500/30 shadow-lg hover:shadow-xl hover:border-purple-500/50 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-linear-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-black text-lg shrink-0 shadow-lg">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="font-bold text-white text-sm truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate font-medium">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const isActive = router.pathname === item.path || router.pathname.startsWith(item.path + '/');
          return (
            <Link key={item.name} href={item.path}>
              <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-300 group relative overflow-hidden ${
                isActive 
                ? 'bg-linear-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/30 scale-105' 
                : 'text-gray-400 hover:bg-linear-to-r hover:from-purple-900/40 hover:to-pink-900/40 hover:text-purple-300 hover:shadow-md'
              }`}>
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  <item.icon size={22} className="shrink-0" />
                </div>
                <span className="font-bold text-sm group-hover:underline underline-offset-4">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-2.5 h-2.5 bg-white rounded-full shrink-0 shadow-lg animate-pulse"></div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="mt-6 pt-6 border-t border-gray-700/50">
        <button 
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-linear-to-r from-red-500/20 to-orange-500/20 hover:from-red-500/40 hover:to-orange-500/40 text-red-400 hover:text-red-300 font-bold transition-all duration-300 border border-red-500/20 hover:border-red-500/40 group shadow-lg hover:shadow-xl"
        >
          <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
          <span>Logout</span>
        </button>
      </div>

      {/* Footer - Version info */}
      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <p className="text-xs text-gray-500 text-center font-semibold">
          Journal Learning Platform
          <br />
          <span className="text-[10px] text-gray-600">v2.0 • Tutor Dashboard</span>
        </p>
      </div>
    </div>
  );
}
