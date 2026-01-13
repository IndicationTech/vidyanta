import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Filter,
  Search,
  Wallet,
  PieChart,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

const Finance = () => {
  const data = [
    { name: "Jan", revenue: 45000, expenses: 32000 },
    { name: "Feb", revenue: 52000, expenses: 34000 },
    { name: "Mar", revenue: 48000, expenses: 31000 },
    { name: "Apr", revenue: 61000, expenses: 38000 },
    { name: "May", revenue: 55000, expenses: 36000 },
    { name: "Jun", revenue: 67000, expenses: 40000 },
  ];

  const transactions = [
    {
      id: "TXN1024",
      student: "Aarav Sharma",
      type: "Tuition Fee",
      amount: 4500,
      date: "2025-06-15",
      status: "Completed",
    },
    {
      id: "TXN1025",
      student: "Ishita Patel",
      type: "Bus Fee",
      amount: 800,
      date: "2025-06-16",
      status: "Completed",
    },
    {
      id: "TXN1026",
      student: "Rohan Gupta",
      type: "Library Fee",
      amount: 200,
      date: "2025-06-16",
      status: "Pending",
    },
    {
      id: "TXN1027",
      student: "Ananya Iyer",
      type: "Exam Fee",
      amount: 1500,
      date: "2025-06-17",
      status: "Completed",
    },
    {
      id: "TXN1028",
      student: "Kabir Singh",
      type: "Tuition Fee",
      amount: 4500,
      date: "2025-06-17",
      status: "Failed",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Finance & Accounts
          </h2>
          <p className="text-slate-500">
            Overview of fees collection, payroll, and institutional expenses.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <Download size={18} />
            <span>Financial Report</span>
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
            <DollarSign size={18} />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: "$245,000",
            change: "+12.5%",
            up: true,
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Fees Collected",
            value: "$182,400",
            change: "+8.2%",
            up: true,
            icon: Wallet,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "Total Expenses",
            value: "$94,200",
            change: "-2.4%",
            up: false,
            icon: Receipt,
            color: "text-rose-600",
            bg: "bg-rose-50",
          },
          {
            label: "Outstanding Fees",
            value: "$22,150",
            change: "+4.1%",
            up: true,
            icon: CreditCard,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={22} />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-bold ${
                  stat.up ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {stat.up ? (
                  <ArrowUpRight size={14} />
                ) : (
                  <ArrowDownRight size={14} />
                )}
                {stat.change}
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Revenue vs Expenses</h3>
            <select className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border-none focus:ring-0">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#f43f5e"
                  strokeWidth={3}
                  fillOpacity={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fee Collection Progress */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6">Recent Transactions</h3>
          <div className="space-y-4">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      txn.status === "Completed"
                        ? "bg-green-50 text-green-600"
                        : txn.status === "Pending"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {txn.student}
                    </p>
                    <p className="text-xs text-slate-500">
                      {txn.type} • {txn.id}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">
                    ${txn.amount}
                  </p>
                  <p className="text-[10px] font-bold uppercase text-slate-400">
                    {txn.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2.5 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
            View All Transactions
          </button>
        </div>
      </div>

      {/* Fee Structure Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Fee Structure (2025-26)</h3>
          <button className="text-sm font-bold text-indigo-600 hover:underline">
            Edit Structure
          </button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                Class Range
              </th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                Annual Fee
              </th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                Exam Fee
              </th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                Transport
              </th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              {
                range: "Preschool - KG",
                annual: "1200",
                exam: "150",
                transport: "500",
                total: "1850",
              },
              {
                range: "Class 1 - 5",
                annual: "1800",
                exam: "200",
                transport: "500",
                total: "2500",
              },
              {
                range: "Class 6 - 8",
                annual: "2400",
                exam: "250",
                transport: "600",
                total: "3250",
              },
              {
                range: "Class 9 - 12",
                annual: "3600",
                exam: "400",
                transport: "600",
                total: "4600",
              },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-bold text-slate-700">
                  {row.range}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  ${row.annual}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  ${row.exam}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  ${row.transport}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-indigo-600">
                  ${row.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Finance;
