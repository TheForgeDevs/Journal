import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats } from '../../services/apiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import TutorLayout from '@/components/tutor/TutorLayout';

export default function TutorPayments() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    graphData: [],
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);

  // Authentication check and redirect
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/auth/tutor?tab=login");
      } else if (user.role !== "tutor") {
        router.push(`/${user.role}/dashboard`);
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    // Only fetch stats if user is authenticated and is a tutor
    if (!authLoading && user && user.role === "tutor") {
      fetchStats();
    }
  }, [authLoading, user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getDashboardStats();
      setStats(res.data.data);
    } catch (err) {
      console.error("Error fetching stats", err);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while auth state is being determined
  if (authLoading) {
    return (
      <TutorLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      </TutorLayout>
    );
  }

  // Redirect handled by useEffect, return null if not authenticated
  if (!user || user.role !== "tutor") return null;

  return (
    <TutorLayout>
      <div className="space-y-8">
        
        {/* Header Stat Card */}
        <div className="bg-linear-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
          <p className="text-purple-100 font-medium mb-1">Total Lifetime Revenue</p>
          <h1 className="text-4xl font-bold">₹{stats.totalRevenue.toLocaleString()}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Revenue Graph (Requirement 8) */}
          <div className="bg-linear-to-br from-[#1E1E2E] to-[#2B2B40] p-6 rounded-2xl shadow-sm border border-gray-800/50 h-96">
            <h3 className="text-xl font-bold mb-6 text-white">Monthly Revenue</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.graphData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#444" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #444', backgroundColor: '#1E1E2E', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)' }} 
                  labelStyle={{ color: '#fff' }}
                  cursor={{ fill: '#2B2B40' }}
                />
                <Bar dataKey="revenue" fill="#7C3AED" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Transactions Table (Requirement 10) */}
          <div className="bg-linear-to-br from-[#1E1E2E] to-[#2B2B40] p-6 rounded-2xl shadow-sm border border-gray-800/50 h-96 overflow-y-auto">
            <h3 className="text-xl font-bold mb-6 text-white">Recent Transactions</h3>
            <div className="space-y-4">
              {stats.recentTransactions.length > 0 ? (
                stats.recentTransactions.map((tx) => (
                  <div key={tx._id} className="flex justify-between items-center p-3 hover:bg-[#2B2B40]/60 rounded-lg transition-colors border border-gray-800/30 hover:border-purple-500/30">
                    <div>
                      <p className="font-semibold text-white">Payment received</p>
                      <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="text-green-400 font-bold bg-green-600/20 px-3 py-1 rounded-full text-sm border border-green-500/50">
                      +₹{tx.amount}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 italic">No recent transactions found.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </TutorLayout>
  );
}