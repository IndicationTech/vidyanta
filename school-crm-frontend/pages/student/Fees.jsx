import React from "react";
import {
  CreditCard,
  DollarSign,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

const Fees = () => {
  const feeHistory = [
    {
      id: "INV-2025-004",
      month: "May 2025",
      type: "Monthly Tuition",
      amount: 4500,
      date: "2025-05-10",
      status: "Paid",
    },
    {
      id: "INV-2025-003",
      month: "April 2025",
      type: "Monthly Tuition",
      amount: 4500,
      date: "2025-04-12",
      status: "Paid",
    },
    {
      id: "INV-2025-002",
      month: "March 2025",
      type: "Monthly Tuition",
      amount: 4500,
      date: "2025-03-08",
      status: "Paid",
    },
    {
      id: "INV-2025-001",
      month: "Feb 2025",
      type: "Registration + Tuition",
      amount: 8500,
      date: "2025-02-15",
      status: "Paid",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Fees & Payments</h2>
          <p className="text-slate-500">
            Manage fee payments and view transaction history.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-indigo-100 text-sm font-medium mb-1">
                    Current Pending Amount
                  </p>
                  <h3 className="text-4xl font-bold">$4,500.00</h3>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl">
                  <CreditCard size={28} />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg">
                  Pay Now
                </button>
                <button className="text-indigo-100 font-bold hover:text-white transition-colors flex items-center gap-2">
                  View Breakup
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Payment History</h3>
              <button className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline">
                <Download size={14} />
                Export History
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                      Invoice ID
                    </th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                      Description
                    </th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {feeHistory.map((fee) => (
                    <tr
                      key={fee.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4 text-sm font-bold text-slate-700">
                        {fee.id}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-900">
                          {fee.month}
                        </p>
                        <p className="text-xs text-slate-500">{fee.type}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">
                        ${fee.amount}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {fee.date}
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1 text-emerald-600 font-bold text-[10px] uppercase">
                          <CheckCircle2 size={12} />
                          {fee.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100">
            <div className="flex items-center gap-3 mb-4 text-amber-700">
              <AlertCircle size={20} />
              <h4 className="font-bold">Next Payment Due</h4>
            </div>
            <p className="text-sm text-amber-800 mb-4 font-medium">
              Your next tuition fee payment of <strong>$4,500</strong> is due on{" "}
              <strong>June 10, 2025</strong>.
            </p>
            <div className="bg-white/50 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-amber-600 uppercase">
                  Days Remaining
                </p>
                <p className="text-xl font-bold text-amber-900">12 Days</p>
              </div>
              <button className="bg-amber-600 text-white p-2.5 rounded-xl">
                <Calendar size={20} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-4">Saved Methods</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-1.5 rounded-lg shadow-sm">
                    <CreditCard size={18} className="text-slate-600" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">•••• 4242</p>
                </div>
                <span className="text-[10px] font-bold text-slate-400">
                  VISA
                </span>
              </div>
              <button className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 text-sm font-bold hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                + Add New Method
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fees;
