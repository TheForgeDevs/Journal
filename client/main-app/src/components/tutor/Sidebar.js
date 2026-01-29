import Link from 'next/link';
import { useRouter } from 'next/router';

const menuItems = [
  { name: 'Dashboard', path: '/tutor/dashboard', icon: '📊' },
  { name: 'My Courses', path: '/tutor/courses', icon: '📚' },
  { name: 'Learners', path: '/tutor/learners', icon: '👥' },
  { name: 'Payments', path: '/tutor/payments', icon: '💰' },
  { name: 'Reviews', path: '/tutor/reviews', icon: '⭐' },
  { name: 'Profile', path: '/tutor/profile', icon: '👤' },
];

export default function TutorSidebar() {
  const router = useRouter();

  return (
    <div className="w-64 bg-white h-screen shadow-xl fixed left-0 top-0 p-4">
      <div className="mb-10 px-4">
        <h2 className="text-2xl font-bold text-purple-700">TutorPanel</h2>
      </div>
      <nav>
        {menuItems.map((item) => (
          <Link key={item.name} href={item.path}>
            <div className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
              router.pathname === item.path ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'
            }`}>
              <span className="mr-3">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
}