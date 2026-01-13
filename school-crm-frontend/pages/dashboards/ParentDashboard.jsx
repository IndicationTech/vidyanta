import React from "react";
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";

const ParentDashboard = () => {
  const stats = [
    {
      label: "My Children",
      value: "2",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Pending Fees",
      value: "₹2,400",
      icon: DollarSign,
      color: "bg-orange-500",
    },
    {
      label: "Avg Performance",
      value: "88%",
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      label: "Attendance",
      value: "94%",
      icon: CheckCircle,
      color: "bg-purple-500",
    },
  ];

  const children = [
    {
      id: "1",
      name: "Aarav Sharma",
      grade: "10th A",
      performance: "92%",
      attendance: "96%",
    },
    {
      id: "2",
      name: "Priya Sharma",
      grade: "8th B",
      performance: "85%",
      attendance: "92%",
    },
  ];

  const feePayments = [
    {
      id: "1",
      child: "Aarav Sharma",
      amount: 1200,
      dueDate: "2024-03-15",
      status: "pending",
    },
    {
      id: "2",
      child: "Priya Sharma",
      amount: 1200,
      dueDate: "2024-03-20",
      status: "pending",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold">Parent Dashboard</h2>
          <p className="text-slate-500">
            Monitor your children's progress and payments
          </p>
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
          <h3 className="text-lg font-bold mb-4">My Children</h3>
          <div className="space-y-3">
            {children.map((child) => (
              <div
                key={child.id}
                className="p-4 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm">{child.name}</p>
                  <span className="text-xs text-slate-500">{child.grade}</span>
                </div>
                <div className="flex gap-4 text-xs">
                  <div>
                    <span className="text-slate-500">Performance: </span>
                    <span className="font-medium text-green-600">
                      {child.performance}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Attendance: </span>
                    <span className="font-medium text-blue-600">
                      {child.attendance}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-4">Pending Fee Payments</h3>
          <div className="space-y-3">
            {feePayments.map((fee) => (
              <div
                key={fee.id}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100"
              >
                <div>
                  <p className="font-semibold text-sm">{fee.child}</p>
                  <p className="text-xs text-slate-500">Due: {fee.dueDate}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-600">₹{fee.amount}</p>
                  <span className="text-xs text-orange-500">{fee.status}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm text-indigo-600 font-semibold hover:bg-indigo-50 rounded-xl transition-colors">
            Pay All Fees
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
