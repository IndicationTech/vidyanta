import React from "react";
import { MOCK_TEACHERS } from "../../constants";
import {
  Users,
  UserCheck,
  Clock,
  TrendingUp,
  DollarSign,
  Calendar,
} from "lucide-react";

const HRDashboard = () => {
  const stats = [
    {
      label: "Total Staff",
      value: MOCK_TEACHERS.length.toString(),
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Active Staff",
      value: "12",
      icon: UserCheck,
      color: "bg-green-500",
    },
    {
      label: "On Leave",
      value: "2",
      icon: Clock,
      color: "bg-orange-500",
    },
    {
      label: "Payroll This Month",
      value: "₹45,000",
      icon: DollarSign,
      color: "bg-purple-500",
    },
  ];

  const staffOnLeave = [
    {
      id: "1",
      name: "Sunita Banerjee",
      reason: "Sick Leave",
      returnDate: "2024-03-15",
    },
    {
      id: "2",
      name: "Rajesh Kumar",
      reason: "Personal Leave",
      returnDate: "2024-03-12",
    },
  ];

  const upcomingPayroll = [
    {
      id: "1",
      name: "Dr. Meera Kulkarni",
      amount: 5500,
      dueDate: "2024-03-15",
    },
    { id: "2", name: "Rajesh Kumar", amount: 5200, dueDate: "2024-03-15" },
    { id: "3", name: "Sunita Banerjee", amount: 4800, dueDate: "2024-03-15" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold">HR Dashboard</h2>
          <p className="text-slate-500">
            Manage staff, payroll, and human resources
          </p>
        </div>
        <div className="bg-white p-2 rounded-lg border border-slate-200 flex items-center gap-2 text-sm text-slate-600">
          <Calendar size={16} />
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
          <h3 className="text-lg font-bold mb-4">Staff on Leave</h3>
          <div className="space-y-3">
            {staffOnLeave.map((staff) => (
              <div
                key={staff.id}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100"
              >
                <div>
                  <p className="font-semibold text-sm">{staff.name}</p>
                  <p className="text-xs text-slate-500">{staff.reason}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-orange-600">
                    Returns: {staff.returnDate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-4">Upcoming Payroll</h3>
          <div className="space-y-3">
            {upcomingPayroll.map((payroll) => (
              <div
                key={payroll.id}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100"
              >
                <div>
                  <p className="font-semibold text-sm">{payroll.name}</p>
                  <p className="text-xs text-slate-500">
                    Due: {payroll.dueDate}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">₹{payroll.amount}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm text-indigo-600 font-semibold hover:bg-indigo-50 rounded-xl transition-colors">
            Process Payroll
          </button>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
