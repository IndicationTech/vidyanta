import React from "react";
import {
  MOCK_STUDENTS,
  MOCK_TEACHERS,
  MOCK_TRANSACTIONS,
} from "../../constants";
import {
  TrendingUp,
  Users,
  GraduationCap,
  DollarSign,
  Clock,
  CheckCircle,
  Building2,
  School,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", revenue: 4000, students: 2400, schools: 5 },
  { name: "Feb", revenue: 3000, students: 1398, schools: 6 },
  { name: "Mar", revenue: 2000, students: 9800, schools: 8 },
  { name: "Apr", revenue: 2780, students: 3908, schools: 10 },
  { name: "May", revenue: 1890, students: 4800, schools: 12 },
  { name: "Jun", revenue: 2390, students: 3800, schools: 15 },
];

const SuperAdminDashboard = () => {
  const stats = [
    {
      label: "Total Schools",
      value: "15",
      icon: Building2,
      color: "bg-indigo-500",
    },
    {
      label: "Total Students",
      value: MOCK_STUDENTS.length.toString(),
      icon: GraduationCap,
      color: "bg-blue-500",
    },
    {
      label: "Total Staff",
      value: MOCK_TEACHERS.length.toString(),
      icon: Users,
      color: "bg-purple-500",
    },
    {
      label: "System Revenue",
      value: "₹2,45,000",
      icon: DollarSign,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold">Super Admin Dashboard</h2>
          <p className="text-slate-500">System-wide overview and management</p>
        </div>
        <div className="bg-white p-2 rounded-lg border border-slate-200 flex items-center gap-2 text-sm text-slate-600">
          <Clock size={16} />
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className={`${stat.color} p-3 rounded-xl text-white`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6">System Revenue & Growth</h3>
          <div className="h-[300px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={0}
              minHeight={300}
            >
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
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
                  tick={{ fill: "#94a3b8" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8" }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6">Schools Growth</h3>
          <div className="h-[300px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={0}
              minHeight={300}
            >
              <BarChart data={data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8" }}
                />
                <Tooltip />
                <Bar dataKey="schools" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold mb-4">Recent System Transactions</h3>
        <div className="space-y-4">
          {MOCK_TRANSACTIONS.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${
                    tx.type === "Fee"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {tx.type === "Fee" ? (
                    <CheckCircle size={16} />
                  ) : (
                    <Clock size={16} />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm">{tx.studentName}</p>
                  <p className="text-xs text-slate-500">
                    {tx.type} • {tx.date}
                  </p>
                </div>
              </div>
              <p
                className={`font-bold ${
                  tx.type === "Fee" ? "text-green-600" : "text-slate-900"
                }`}
              >
                {tx.type === "Fee" ? "+" : "-"}₹{tx.amount}
              </p>
            </div>
          ))}
        </div>
        <button className="w-full mt-6 py-2 text-sm text-indigo-600 font-semibold hover:bg-indigo-50 rounded-xl transition-colors">
          View All Transactions
        </button>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
