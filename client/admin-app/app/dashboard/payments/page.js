"use client";

import { useEffect, useState } from "react";
import { paymentsAPI } from "@/lib/api";
import toast from "react-hot-toast";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = filter !== "all" ? { status: filter } : {};
      const response = await paymentsAPI.getAll(params);
      setPayments(response.data.data.payments || []);
    } catch (error) {
      toast.error("Failed to fetch payments");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (paymentId, newStatus) => {
    try {
      await paymentsAPI.updateStatus(paymentId, newStatus);
      toast.success("Payment status updated");
      fetchPayments();
    } catch (error) {
      toast.error("Failed to update payment status");
    }
  };

  const filteredPayments = payments.filter(
    (payment) =>
      payment.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      payment.course?.title?.toLowerCase().includes(search.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalRevenue = filteredPayments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Payment Management</h1>
        <p className="text-gray-600 mt-2">Manage all payment transactions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
          <p className="text-sm opacity-80">Total Revenue</p>
          <p className="text-3xl font-bold mt-2">
            ₹{totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
          <p className="text-sm opacity-80">Successful Payments</p>
          <p className="text-3xl font-bold mt-2">
            {filteredPayments.filter((p) => p.status === "completed").length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-md p-6 text-white">
          <p className="text-sm opacity-80">Pending Payments</p>
          <p className="text-3xl font-bold mt-2">
            {filteredPayments.filter((p) => p.status === "pending").length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg transition ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 rounded-lg transition ${
                filter === "completed"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-lg transition ${
                filter === "pending"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("failed")}
              className={`px-4 py-2 rounded-lg transition ${
                filter === "failed"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Failed
            </button>
          </div>

          <input
            type="text"
            placeholder="Search payments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Transaction
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Course
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-mono text-sm text-gray-600">
                        {payment.transactionId}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">
                          {payment.user?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {payment.user?.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">
                        {payment.course?.title}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-green-600">
                        ₹{payment.amount?.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          payment.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : payment.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {payment.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleUpdateStatus(payment._id, "completed")
                            }
                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(payment._id, "failed")
                            }
                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPayments.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No payments found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
