import TutorSidebar from './Sidebar';
import MobileTabBar from './MobileTabBar';

export default function TutorLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#0F0F1E]">
      {/* Desktop Sidebar - Only visible on large screens */}
      <div className="hidden lg:block sticky top-0 left-0 h-screen">
        <TutorSidebar />
      </div>

      {/* Main Content Area - Responsive padding and margins */}
      <main className="flex-1 w-full p-3 sm:p-4 lg:p-5 pb-16 lg:pb-5">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Tab Bar - Only visible on mobile/tablet */}
      <MobileTabBar />
    </div>
  );
}